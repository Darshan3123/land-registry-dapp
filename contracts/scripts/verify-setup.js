const hre = require("hardhat");

async function main() {
  console.log("🔍 Verifying DApp Setup...\n");
  
  // Contract details
  const contractAddress = "0x162459Bb429a63D2e31Fe2d1cdb5b058f2D31AdF";
  const adminAddress = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71";
  
  console.log("📋 Contract Information:");
  console.log("  Contract Address:", contractAddress);
  console.log("  Expected Admin:", adminAddress);
  
  // Check if contract exists
  try {
    const code = await hre.ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ Contract not found! Need to redeploy.");
      return;
    }
    console.log("✅ Contract exists on network");
  } catch (error) {
    console.log("❌ Error checking contract:", error.message);
    return;
  }
  
  // Check admin balance
  try {
    const balance = await hre.ethers.provider.getBalance(adminAddress);
    console.log("💰 Admin Balance:", hre.ethers.formatEther(balance), "ETH");
    
    if (balance > 0) {
      console.log("✅ Admin has sufficient funds");
    } else {
      console.log("❌ Admin needs funds");
    }
  } catch (error) {
    console.log("❌ Error checking balance:", error.message);
  }
  
  // Try to connect to contract
  try {
    const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
    const contract = LandRegistry.attach(contractAddress);
    
    const contractAdmin = await contract.admin();
    console.log("🔐 Actual Contract Admin:", contractAdmin);
    
    if (contractAdmin.toLowerCase() === adminAddress.toLowerCase()) {
      console.log("✅ Admin address matches!");
    } else {
      console.log("❌ Admin address mismatch!");
    }
  } catch (error) {
    console.log("❌ Error connecting to contract:", error.message);
  }
  
  console.log("\n🎯 Next Steps:");
  console.log("1. Switch MetaMask to 'Localhost 8545' network");
  console.log("2. Connect to account:", adminAddress);
  console.log("3. Refresh dapp and try again");
  console.log("\n🌐 Network Details for MetaMask:");
  console.log("  Network Name: Localhost 8545");
  console.log("  RPC URL: http://127.0.0.1:8545");
  console.log("  Chain ID: 31337");
  console.log("  Currency: ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });