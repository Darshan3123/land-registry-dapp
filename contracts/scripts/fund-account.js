const hre = require("hardhat");

async function main() {
  const targetAddress = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71";
  const amountToSend = "1000"; // 1000 ETH
  
  console.log(`💰 Funding account ${targetAddress} with ${amountToSend} ETH...`);
  
  // Get the first account (which has ETH)
  const [sender] = await hre.ethers.getSigners();
  
  // Send ETH to target address
  const tx = await sender.sendTransaction({
    to: targetAddress,
    value: hre.ethers.parseEther(amountToSend)
  });
  
  await tx.wait();
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(targetAddress);
  
  console.log(`✅ Successfully funded!`);
  console.log(`📋 Address: ${targetAddress}`);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log(`🔗 Transaction: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });