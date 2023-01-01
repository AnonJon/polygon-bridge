require("dotenv").config();
import config from "../../config/network.config.json";
import { ethers, network as networkName } from "hardhat";
import { deploy, verify } from "../../test/utils/helpers";

async function main() {
  let fxRoot: string,
    checkpointManager: string,
    fxERC20: string,
    fxERC721: string,
    fxERC1155: string,
    xERC677Token: string;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 1) {
    // Ethereum Mainnet
    fxRoot = config.mainnet.fxRoot.address;
    checkpointManager = config.mainnet.checkpointManager.address;
    fxERC20 = config.mainnet.fxERC20.address;
    fxERC721 = config.mainnet.fxERC721.address;
    fxERC1155 = config.mainnet.fxERC1155.address;
    xERC677Token = config.mainnet.xERC677.address;
  } else if (network.chainId === 5) {
    // Goerli Testnet
    fxRoot = config.testnet.fxRoot.address;
    checkpointManager = config.testnet.checkpointManager.address;
    fxERC20 = config.testnet.fxERC20.address;
    fxERC721 = config.testnet.fxERC721.address;
    fxERC1155 = config.testnet.fxERC1155.address;
    xERC677Token = config.testnet.xERC677.address;
  } else {
    throw new Error("Invalid network");
  }

  const tunnel = await deploy("XERC20RootTunnel", [
    checkpointManager,
    fxRoot,
    xERC677Token,
  ]);
  await tunnel.deployed();
  console.log("ERC20RootTunnel deployed to:", tunnel.address);
  await verify(
    networkName.name,
    tunnel.address,
    checkpointManager,
    fxRoot,
    xERC677Token
  );
  console.log(
    `npx hardhat verify --network ${networkName.name} ${tunnel.address} ${checkpointManager} ${fxRoot} ${xERC677Token}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
