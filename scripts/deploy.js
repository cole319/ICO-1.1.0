const hre = require("hardhat");

async function main() {
  const bridgeCoin = await hre.ethers.deployContract("BridgeCoin");

  await bridgeCoin.waitForDeployment();

  console.log(`BridgeCoin Contract deployed at ${bridgeCoin.target}`);

  const bridgeCoinSale = await hre.ethers.deployContract("BridgeCoinSale", [
    2,
    "0xb2EB88976AaE52aC630599b19aEd0179dbEb2fB6",
    bridgeCoin.target,
  ]);

  await bridgeCoinSale.waitForDeployment();

  console.log(`BridgeCoinSale Contract deployed at ${bridgeCoinSale.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
