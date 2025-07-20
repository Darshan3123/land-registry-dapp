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

  // Land Registration
  async registerLand(landData) {
    try {
      const tx = await this.contract.registerLand(
        landData.location,
        landData.area,
        landData.landType,
        landData.ipfsHash
      );
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error registering land:", error);
      throw error;
    }
  }

  // Get Land Details
  async getLandDetails(landId) {
    try {
      const land = await this.contract.getLandDetails(landId);
      return {
        id: land.id,
        owner: land.owner,
        location: land.location,
        area: land.area,
        landType: land.landType,
        isVerified: land.isVerified,
        ipfsHash: land.ipfsHash,
        registrationDate: new Date(Number(land.registrationDate) * 1000),
      };
    } catch (error) {
      console.error("Error getting land details:", error);
      throw error;
    }
  }

  // Transfer Ownership
  async transferOwnership(landId, newOwner) {
    try {
      const tx = await this.contract.transferOwnership(landId, newOwner);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error transferring ownership:", error);
      throw error;
    }
  }

  // Get User's Lands
  async getUserLands(userAddress) {
    try {
      const landIds = await this.contract.getUserLands(userAddress);
      const lands = await Promise.all(
        landIds.map((id) => this.getLandDetails(id))
      );
      return lands;
    } catch (error) {
      console.error("Error getting user lands:", error);
      throw error;
    }
  }

  // Verify Land (Inspector only)
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

  // Get User Role
  async getUserRole(userAddress) {
    try {
      const role = await this.contract.getUserRole(userAddress);
      const roles = ["Admin", "Inspector", "User"];
      return roles[role] || "User";
    } catch (error) {
      console.error("Error getting user role:", error);
      return "User";
    }
  }

  // Get All Lands (for admin dashboard)
  async getAllLands() {
    try {
      const totalLands = await this.contract.landCounter();
      const lands = [];
      
      for (let i = 1; i <= totalLands; i++) {
        try {
          const land = await this.getLandDetails(i);
          lands.push(land);
        } catch (error) {
          // Skip if land doesn't exist or error occurred
          console.warn(`Error getting land ${i}:`, error);
        }
      }
      
      return lands;
    } catch (error) {
      console.error("Error getting all lands:", error);
      return [];
    }
  }

  // Transfer Land (alias for transferOwnership)
  async transferLand(landId, newOwner) {
    return this.transferOwnership(landId, newOwner);
  }

  // Listen to Events
  onLandRegistered(callback) {
    this.contract.on("LandRegistered", callback);
  }

  onOwnershipTransferred(callback) {
    this.contract.on("OwnershipTransferred", callback);
  }

  onLandVerified(callback) {
    this.contract.on("LandVerified", callback);
  }
}

export default BlockchainService;
