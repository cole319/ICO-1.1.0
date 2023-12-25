const hre = require("hardhat");

async function main() {
  const bridgeCoin = await hre.ethers.deployContract("BridgeCoin");

  await bridgeCoin.waitForDeployment();

  console.log(`BridgeToken Contract deployed at ${bridgeCoin.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
