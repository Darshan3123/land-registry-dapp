import axios from "axios";

// Store API keys in environment variables in production
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY || "2bedbcdaa18ca2f5e0bb";
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY || "12275d0db1dc55a32aca1d43a3a60cf40987ca51362f46aadbfd55fa0e0fdbff";

// Enhanced cache with localStorage persistence to prevent duplicate uploads across sessions
const ipfsCache = (() => {
  const CACHE_KEY = 'ipfs_upload_cache';
  // Load cache from localStorage if available
  let cache;
  try {
    const savedCache = localStorage.getItem(CACHE_KEY);
    cache = savedCache ? new Map(JSON.parse(savedCache)) : new Map();
  } catch (e) {
    console.warn('Failed to load IPFS cache from localStorage:', e);
    cache = new Map();
  }

  // Save cache to localStorage
  const saveCache = () => {
    try {
      // Convert Map to array for JSON serialization
      localStorage.setItem(CACHE_KEY, JSON.stringify(Array.from(cache.entries())));
    } catch (e) {
      console.warn('Failed to save IPFS cache to localStorage:', e);
    }
  };

  // Return wrapped Map with persistence
  return {
    has: key => cache.has(key),
    get: key => cache.get(key),
    set: (key, value) => {
      cache.set(key, value);
      saveCache();
      return value;
    },
    // Limit cache size to prevent memory issues
    prune: () => {
      if (cache.size > 50) {
        const keysToDelete = Array.from(cache.keys()).slice(0, 10);
        keysToDelete.forEach(key => cache.delete(key));
        saveCache();
      }
    }
  };
})();

/**
 * Optimized function to upload file to IPFS with enhanced caching, compression and error handling
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The IPFS URL
 */
export const uploadFileToIPFS = async (file) => {
  try {
    // Generate a more reliable cache key using file name, size and last modified date
    const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
    
    // Check if file is already in cache
    if (ipfsCache.has(cacheKey)) {
      console.log("📋 Using cached IPFS hash");
      return ipfsCache.get(cacheKey);
    }
    
    // Compress image files before uploading if possible
    let fileToUpload = file;
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml' && file.size > 500000) {
      try {
        fileToUpload = await compressImage(file);
        console.log(`📦 Compressed image from ${file.size} to ${fileToUpload.size} bytes`);
      } catch (err) {
        console.warn('Image compression failed, using original file:', err);
        fileToUpload = file;
      }
    }
    
    // Create form data with optimized metadata
    const formData = new FormData();
    formData.append("file", fileToUpload);
    
    // Add metadata to optimize pinning
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        timestamp: Date.now().toString(),
        fileSize: file.size.toString(),
        fileType: file.type
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Add options to optimize storage
    const options = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', options);
    
    // Prune cache to prevent memory issues
    ipfsCache.prune();

    // Make API request with timeout, retry logic and progress tracking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS", 
        formData, 
        {
          maxBodyLength: "Infinity",
          timeout: 60000, // 60 second timeout
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`📤 Upload progress: ${percentCompleted}%`);
          },
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      }
    );

      // Use dedicated gateway for better performance
      // Try cloudflare gateway first as it's often faster
      const ipfsUrl = `https://cloudflare-ipfs.com/ipfs/${res.data.IpfsHash}`;
      
      // Cache the result
      ipfsCache.set(cacheKey, ipfsUrl);
      
      return ipfsUrl;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("IPFS upload error:", error);
    // Provide more detailed error messages
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('IPFS upload timed out. Please try again with a smaller file or check your internet connection.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many upload requests. Please wait a moment and try again.');
    } else {
      throw new Error(error.response?.data?.error || "Failed to upload to IPFS. Please try again.");
    }
  }
};

/**
 * Compress an image file to reduce size before uploading
 * @param {File} imageFile - The image file to compress
 * @returns {Promise<File>} - A compressed version of the image
 */
async function compressImage(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height && width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        } else if (height > MAX_HEIGHT) {
          width = Math.round(width * (MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed image as blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            // Create new file from blob
            const compressedFile = new File([blob], imageFile.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7 // Quality parameter (0.7 = 70% quality)
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
  });
};
