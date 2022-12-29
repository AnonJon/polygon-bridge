require("dotenv").config();
const config = require("../../config/network.config.json");
import { ethers } from "hardhat";
import { deploy } from "../../test/utils/helpers";

async function main() {
  let fxRoot, checkpointManager;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 1) {
    // Ethereum Mainnet
    fxRoot = config.mainnet.fxRoot.address;
    checkpointManager = config.mainnet.checkpointManager.address;
  } else if (network.chainId === 5) {
    // Goerli Testnet
    fxRoot = config.testnet.fxRoot.address;
    checkpointManager = config.testnet.checkpointManager.address;
  }

  const state = await deploy("FxStateRootTunnel", [checkpointManager, fxRoot]);
  await state.deployed();
  console.log("StateRootTunnel deployed to:", state.address);
  console.log(
    "npx hardhat verify --network goerli",
    state.address,
    checkpointManager,
    fxRoot
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
