import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '../hooks/useWallet';
import BlockchainService from '../services/blockchain';
import IPFSService from '../services/ipfs';
import { toast } from 'react-toastify';

const RegisterLand = () => {
  const { signer, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setDocuments(files);
  };

  const onSubmit = async (data) => {
    if (!isConnected || !signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    
    try {
      // Upload documents to IPFS
      let ipfsHash = '';
      if (documents.length > 0) {
        const uploadPromises = documents.map(file => 
          IPFSService.uploadFile(file, {
            name: `${data.location}-${file.name}`,
            keyvalues: {
              landLocation: data.location,
              documentType: file.type
            }
          })
        );
        
        const uploadResults = await Promise.all(uploadPromises);
        
        // Create metadata with all document hashes
        const metadata = {
          documents: uploadResults.map((result, index) => ({
            name: documents[index].name,
            hash: result.hash,
            size: result.size,
            type: documents[index].type
          })),
          landDetails: data
        };
        
        const metadataResult = await IPFSService.uploadJSON(metadata, {
          name: `${data.location}-metadata`
        });
        
        ipfsHash = metadataResult.hash;
      }

      // Register land on blockchain
      const blockchainService = new BlockchainService(signer);
      const tx = await blockchainService.registerLand({
        location: data.location,
        area: parseInt(data.area),
        landType: data.landType,
        ipfsHash: ipfsHash
      });

      toast.success('Land registered successfully!');
      console.log('Transaction:', tx);
      
      // Reset form
      reset();
      setDocuments([]);
      
    } catch (error) {
      console.error('Error registering land:', error);
      toast.error('Failed to register land. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Register New Land</h2>
        <p className="text-gray-600">Please connect your wallet to register land</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Register New Land</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter property location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area (sq ft) *
          </label>
          <input
            type="number"
            {...register('area', { 
              required: 'Area is required',
              min: { value: 1, message: 'Area must be greater than 0' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter area in square feet"
          />
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
          )}
        </div>

        {/* Land Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Land Type *
          </label>
          <select
            {...register('landType', { required: 'Land type is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select land type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Industrial">Industrial</option>
          </select>
          {errors.landType && (
            <p className="text-red-500 text-sm mt-1">{errors.landType.message}</p>
          )}
        </div>

        {/* Documents Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Documents
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload property documents (PDF, images, documents)
          </p>
          
          {documents.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">Selected files:</p>
              <ul className="text-sm text-gray-600">
                {documents.map((file, index) => (
                  <li key={index} className="flex justify-between items-center py-1">
                    <span>{file.name}</span>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Registering Land...
            </div>
          ) : (
            'Register Land'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterLand;