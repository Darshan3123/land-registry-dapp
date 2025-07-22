import { ethers } from "ethers";
import LandRegistryABI from "../LandRegistry.json";
import { CONTRACT_ADDRESS } from "../contract-config";

export class BlockchainService {
  constructor(signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      LandRegistryABI.abi,
      signer
    );
  }

  // Get Land Details
  async getLandDetails(landId) {
    try {
      const land = await this.contract.getLand(landId);
      return {
        id: land[0],
        owner: land[1],
        location: land[2],
        documentCID: land[3],
        isVerified: land[4]
      };
    } catch (error) {
      console.error("Error getting land details:", error);
      throw error;
    }
  }

  // Transfer Land
  async transferLand(landId, newOwner) {
    try {
      const tx = await this.contract.transferLand(landId, newOwner);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error transferring land:", error);
      throw error;
    }
  }

  // Get User's Lands (simplified version - checks first 100 land IDs)
  async getUserLands(userAddress) {
    try {
      const lands = [];
      // Check first 100 possible land IDs
      for (let i = 1; i <= 100; i++) {
        try {
          const land = await this.getLandDetails(i);
          if (land.owner.toLowerCase() === userAddress.toLowerCase()) {
            lands.push(land);
          }
        } catch (error) {
          // Land doesn't exist, continue
          continue;
        }
      }
      return lands;
    } catch (error) {
      console.error("Error getting user lands:", error);
      return [];
    }
  }

  // Verify Land (Admin only)
  async verifyLand(landId) {
    try {
      const tx = await this.contract.verifyLand(landId);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error verifying land:", error);
      throw error;
    }
  }

  // Register Land (Admin only)
  async registerLand(landData) {
    try {
      const tx = await this.contract.registerLand(
        landData.landId || Date.now(), // Use timestamp as ID if not provided
        landData.owner || await this.signer.getAddress(),
        landData.location,
        landData.ipfsHash || ""
      );
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error registering land:", error);
      throw error;
    }
  }

  // Listen to Events
  onLandRegistered(callback) {
    this.contract.on("LandRegistered", callback);
  }

  onLandTransferred(callback) {
    this.contract.on("LandTransferred", callback);
  }

  onLandVerified(callback) {
    this.contract.on("LandVerified", callback);
  }
}

export default BlockchainService;
