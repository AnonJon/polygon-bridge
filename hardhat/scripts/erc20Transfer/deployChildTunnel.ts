require("dotenv").config();
import config from "../../config/network.config.json";
import { ethers } from "hardhat";
import { deploy } from "../../test/utils/helpers";

async function main() {
  let fxChild: string,
    fxerc20: string,
    erc721Token: string,
    erc1155Token: string;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 137) {
    // Polygon Mainnet
    fxChild = config.mainnet.fxChild.address;
    fxerc20 = config.mainnet.fxERC20.address;
    erc721Token = config.mainnet.fxERC721.address;
    erc1155Token = config.mainnet.fxERC1155.address;
  } else if (network.chainId === 80001) {
    // Mumbai Testnet
    fxChild = config.testnet.fxChild.address;
    fxerc20 = config.testnet.fxERC20.address;
    erc721Token = config.testnet.fxERC721.address;
    erc1155Token = config.testnet.fxERC1155.address;
  } else {
    throw new Error("Invalid network");
  }

  const erc20 = await deploy("XERC20ChildTunnel", [fxChild, fxerc20]);
  await erc20.deployed();

  console.log("ERC20ChildTunnel deployed to:", erc20.address);
  console.log(
    "npx hardhat verify --network mumbai",
    erc20.address,
    fxChild,
    fxerc20
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
