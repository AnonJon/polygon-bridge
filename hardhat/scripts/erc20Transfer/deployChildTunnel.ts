require("dotenv").config();
import config from "../../config/network.config.json";
import { ethers, network as networkName } from "hardhat";
import { deploy, verify } from "../../test/utils/helpers";

async function main() {
  let fxChild: string,
    fxerc20: string,
    erc721Token: string,
    erc1155Token: string,
    xERC677Token: string;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 137) {
    // Polygon Mainnet
    fxChild = config.mainnet.fxChild.address;
    fxerc20 = config.mainnet.fxERC20.address;
    erc721Token = config.mainnet.fxERC721.address;
    erc1155Token = config.mainnet.fxERC1155.address;
    xERC677Token = config.mainnet.xERC677.address;
  } else if (network.chainId === 80001) {
    // Mumbai Testnet
    fxChild = config.testnet.fxChild.address;
    fxerc20 = config.testnet.fxERC20.address;
    erc721Token = config.testnet.fxERC721.address;
    erc1155Token = config.testnet.fxERC1155.address;
    xERC677Token = config.testnet.xERC677.address;
  } else {
    throw new Error("Invalid network");
  }

  const tunnel = await deploy("XERC20ChildTunnel", [fxChild, xERC677Token]);
  await tunnel.deployed();
  console.log(networkName.name);
  console.log("ChildTunnel deployed to:", tunnel.address);
  await verify(networkName.name, tunnel.address, fxChild, xERC677Token);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
