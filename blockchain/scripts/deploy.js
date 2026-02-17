const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting contract deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} ETH\n`);

  // Deploy SBT Contract
  console.log("📜 Deploying SBT Contract...");
  const SBT = await hre.ethers.getContractFactory("SBT");
  const sbt = await SBT.deploy();
  await sbt.waitForDeployment();
  const sbtAddress = await sbt.getAddress();
  console.log(`✅ SBT deployed to: ${sbtAddress}\n`);

  // Deploy Voting Contract
  console.log("📜 Deploying Voting Contract...");
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const voting = await VotingContract.deploy();
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log(`✅ Voting Contract deployed to: ${votingAddress}\n`);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      SBT: sbtAddress,
      VotingContract: votingAddress
    },
    deployedAt: new Date().toISOString()
  };

  // Save to JSON file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentPath = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Deployment info saved to: ${deploymentPath}\n`);

  // Update .env file
  const envPath = path.join(__dirname, "../../server/.env");
  let envContent = fs.readFileSync(envPath, "utf8");

  // Update contract addresses
  envContent = envContent.replace(
    /SBT_CONTRACT_ADDRESS=.*/,
    `SBT_CONTRACT_ADDRESS=${sbtAddress}`
  );
  envContent = envContent.replace(
    /VOTING_CONTRACT_ADDRESS=.*/,
    `VOTING_CONTRACT_ADDRESS=${votingAddress}`
  );

  fs.writeFileSync(envPath, envContent);
  console.log(`📝 Updated server/.env with contract addresses\n`);

  // Print summary
  console.log("═══════════════════════════════════════");
  console.log("✨ DEPLOYMENT SUCCESSFUL ✨");
  console.log("═══════════════════════════════════════\n");
  console.log("📋 Contract Addresses:");
  console.log(`   SBT: ${sbtAddress}`);
  console.log(`   Voting: ${votingAddress}\n`);
  console.log("📝 Next Steps:");
  console.log("   1. Restart your backend server");
  console.log("   2. Contracts are now ready to use");
  console.log("   3. Admin can create elections and issue SBTs\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
