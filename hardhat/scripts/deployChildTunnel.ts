require("dotenv").config();
const config = require("../config/network.config.json");
import { ethers } from "hardhat";
import {deploy} from "../test/util";

async function main() {
  let fxChild, erc20Token, erc721Token, erc1155Token;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 137) {
    // Polygon Mainnet
    fxChild = config.mainnet.fxChild.address;
    erc20Token = config.mainnet.fxERC20.address;
    erc721Token = config.mainnet.fxERC721.address;
    erc1155Token = config.mainnet.fxERC1155.address;
  } else if (network.chainId === 80001) {
    // Mumbai Testnet
    fxChild = config.testnet.fxChild.address;
    erc20Token = config.testnet.fxERC20Mumbai.address;
    erc721Token = config.testnet.fxERC721.address;
    erc1155Token = config.testnet.fxERC1155.address;
  }

    const erc20 = await deploy("FxERC20ChildTunnel", [fxChild,erc20Token]);
    await erc20.deployed();

  console.log("ERC20ChildTunnel deployed to:", erc20.address);
  console.log(
    "npx hardhat verify --network mumbai",
    erc20.address,
    fxChild,
    erc20Token
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });