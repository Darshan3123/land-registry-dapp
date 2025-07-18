const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    // Target admin address
    const targetAdmin = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71";

    console.log("🚀 Deploying LandRegistry contract...");
    console.log("🎯 Target Admin:", targetAdmin);

    // Get all signers
    const signers = await hre.ethers.getSigners();
    console.log("\nAvailable accounts:");
    for (let i = 0; i < Math.min(signers.length, 5); i++) {
        console.log(`  ${i}: ${await signers[i].getAddress()}`);
    }

    // Find the signer that matches our target admin
    let adminSigner = null;
    for (const signer of signers) {
        if ((await signer.getAddress()).toLowerCase() === targetAdmin.toLowerCase()) {
            adminSigner = signer;
            break;
        }
    }

    if (!adminSigner) {
        console.log("⚠️  Target admin not found in signers, using default signer");
        adminSigner = signers[0];
    }

    console.log("👤 Using admin:", await adminSigner.getAddress());

    // Deploy the contract with specific admin
    const LandRegistry = await hre.ethers.getContractFactory("LandRegistry", adminSigner);
    const landRegistry = await LandRegistry.deploy();

    await landRegistry.waitForDeployment();

    const contractAddress = await landRegistry.getAddress();
    console.log("✅ LandRegistry deployed to:", contractAddress);

    // Verify admin
    const contractAdmin = await landRegistry.admin();
    console.log("🔐 Contract Admin:", contractAdmin);

    // Get the contract artifact
    const contractArtifact = await hre.artifacts.readArtifact("LandRegistry");

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
    console.log("\n📋 Summary:");
    console.log("  Contract Address:", contractAddress);
    console.log("  Admin Address:", contractAdmin);
    console.log("  Network: localhost");

    console.log("\n🎯 Next Steps:");
    console.log("1. Make sure MetaMask is connected to localhost:8545");
    console.log("2. Switch to admin account:", contractAdmin);
    console.log("3. Refresh your dapp and try registering land");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });