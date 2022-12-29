require("dotenv").config();
const config = require("../../config/network.config.json");
import { ethers } from "hardhat";
import { deploy } from "../../test/utils/helpers";

async function main() {
  let fxChild;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 137) {
    // Polygon Mainnet
    fxChild = config.mainnet.fxChild.address;
  } else if (network.chainId === 80001) {
    // Mumbai Testnet
    fxChild = config.testnet.fxChild.address;
  }

  const state = await deploy("FxStateChildTunnel", [fxChild]);
  await state.deployed();

  console.log("StateChildTunnel deployed to:", state.address);
  console.log("npx hardhat verify --network mumbai", state.address, fxChild);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
