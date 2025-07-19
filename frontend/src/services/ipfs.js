import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

export class IPFSService {
  constructor() {
    this.headers = {
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY
    };
  }

  // Upload file to IPFS
  async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: metadata.keyvalues || {}
      });
      formData.append('pinataMetadata', pinataMetadata);

      const response = await axios.post(
        `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return {
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        timestamp: response.data.Timestamp
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  // Upload JSON data to IPFS
  async uploadJSON(data, metadata = {}) {
    try {
      const response = await axios.post(
        `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
        {
          pinataContent: data,
          pinataMetadata: {
            name: metadata.name || 'land-registry-data',
            keyvalues: metadata.keyvalues || {}
          }
        },
        { headers: this.headers }
      );

      return {
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        timestamp: response.data.Timestamp
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  // Get file from IPFS
  async getFile(hash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
      return response.data;
    } catch (error) {
      console.error('Error getting file from IPFS:', error);
      throw error;
    }
  }

  // Get file URL
  getFileURL(hash) {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  // Unpin file from IPFS
  async unpinFile(hash) {
    try {
      await axios.delete(
        `${PINATA_BASE_URL}/pinning/unpin/${hash}`,
        { headers: this.headers }
      );
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const response = await axios.get(
        `${PINATA_BASE_URL}/data/testAuthentication`,
        { headers: this.headers }
      );
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!';
    } catch (error) {
      console.error('IPFS connection test failed:', error);
      return false;
    }
  }
}

export default new IPFSService();