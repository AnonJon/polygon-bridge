require("dotenv").config();
const config = require("../../config/network.config.json");
import { ethers } from "hardhat";
import { deploy } from "../../test/utils/helpers";

async function main() {
  let fxRoot, checkpointManager, fxERC20, fxERC721, fxERC1155;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 1) {
    // Ethereum Mainnet
    fxRoot = config.mainnet.fxRoot.address;
    checkpointManager = config.mainnet.checkpointManager.address;
    fxERC20 = config.mainnet.fxERC20.address;
    fxERC721 = config.mainnet.fxERC721.address;
    fxERC1155 = config.mainnet.fxERC1155.address;
  } else if (network.chainId === 5) {
    // Goerli Testnet
    fxRoot = config.testnet.fxRoot.address;
    checkpointManager = config.testnet.checkpointManager.address;
    fxERC20 = config.testnet.fxERC20.address;
    fxERC721 = config.testnet.fxERC721.address;
    fxERC1155 = config.testnet.fxERC1155.address;
  }

  const erc20 = await deploy("FxERC20RootTunnel", [
    checkpointManager,
    fxRoot,
    fxERC20,
  ]);
  await erc20.deployed();
  console.log("ERC20RootTunnel deployed to:", erc20.address);
  console.log(
    "npx hardhat verify --network goerli",
    erc20.address,
    checkpointManager,
    fxRoot,
    fxERC20
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
