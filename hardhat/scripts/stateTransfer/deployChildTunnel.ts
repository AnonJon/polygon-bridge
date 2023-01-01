require("dotenv").config();
import config from "../../config/network.config.json";
import { ethers } from "hardhat";
import { deploy, verify } from "../../test/utils/helpers";

async function main() {
  let fxChild: string;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 137) {
    // Polygon Mainnet
    fxChild = config.mainnet.fxChild.address;
  } else if (network.chainId === 80001) {
    // Mumbai Testnet
    fxChild = config.testnet.fxChild.address;
  } else {
    throw new Error("Invalid network");
  }

  const state = await deploy("XStateChildTunnel", [fxChild]);
  await state.deployed();

  console.log("StateChildTunnel deployed to:", state.address);
  await verify(network.name, state.address, fxChild);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
