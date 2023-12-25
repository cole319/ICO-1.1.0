const hre = require("hardhat");

const ownerAddress = "0xb2EB88976AaE52aC630599b19aEd0179dbEb2fB6"; //Account 12
const tokenAddress = "0x3358a9cC0fe1dC3D36Ba922112ccb66A581f2aEC";

async function main() {
  const bridgeCoinSale = await hre.ethers.deployContract("BridgeCoinSale", [
    2,
    ownerAddress,
    tokenAddress,
  ]);

  await bridgeCoinSale.waitForDeployment();

  console.log(`BridgeToken Contract deployed at ${bridgeCoinSale.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
