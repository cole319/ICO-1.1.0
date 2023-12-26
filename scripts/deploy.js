const hre = require("hardhat");

async function main() {
  const bridgeCoin = await hre.ethers.deployContract("BridgeCoin");

  await bridgeCoin.waitForDeployment();

  console.log(`BridgeCoin Contract deployed at ${bridgeCoin.target}`);

  const bridgeCoinSale = await hre.ethers.deployContract("BridgeCoinSale", [
    bridgeCoin.target,
  ]);

  await bridgeCoinSale.waitForDeployment();

  console.log(`BridgeCoinSale Contract deployed at ${bridgeCoinSale.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
COIN_DEPLOYMENT_ADDRESS = "0x4A838274C6ADd07DD23741589846D74Facf66f6D"
COINSALE_DEPLOYMENT_ADDRESS = "0x669e629Df706BA32C6aB53f1EA7fb2DD51B517d1"

npx hardhat console --network sepolia
owner: 0x03FD96F3FFF601756262a461B77437a2C26EFb28 (AccountBridge#1)
*/
