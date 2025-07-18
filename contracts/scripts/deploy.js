const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying LandRegistry contract...");
  
  // Get all signers
  const signers = await hre.ethers.getSigners();
  console.log("Available accounts:");
  for (let i = 0; i < Math.min(signers.length, 5); i++) {
    console.log(`  ${i}: ${await signers[i].getAddress()}`);
  }
  
  // Deploy the contract (constructor sets msg.sender as admin)
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();
  
  await landRegistry.waitForDeployment();
  
  const contractAddress = await landRegistry.getAddress();
  console.log("✅ LandRegistry deployed to:", contractAddress);
  
  // Get the contract artifact
  const contractArtifact = await hre.artifacts.readArtifact("LandRegistry");
  
  // Create the JSON file for frontend
  const contractData = {
    address: contractAddress,
    abi: contractArtifact.abi
  };
  
  // Write to frontend directory
  const frontendPath = path.join(__dirname, "../../frontend/src");
  
  // Update contract-config.js
  const configContent = `import contractJson from "./LandRegistry.json";

export const CONTRACT_ADDRESS = "${contractAddress}";
export const ABI = contractJson.abi;
`;
  
  fs.writeFileSync(path.join(frontendPath, "contract-config.js"), configContent);
  
  // Update LandRegistry.json with new address
  const updatedArtifact = {
    ...contractArtifact,
    address: contractAddress
  };
  
  fs.writeFileSync(
    path.join(frontendPath, "LandRegistry.json"), 
    JSON.stringify(updatedArtifact, null, 2)
  );
  
  console.log("✅ Contract address updated in frontend files");
  console.log("📋 Contract Address:", contractAddress);
  console.log("👤 Admin Address:", (await hre.ethers.getSigners())[0].address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });