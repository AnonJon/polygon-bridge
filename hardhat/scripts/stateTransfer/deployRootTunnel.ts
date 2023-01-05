require("dotenv").config();
import config from "../../config/network.config.json";
import { ethers } from "hardhat";
import { deploy, verify } from "../../test/utils/helpers";

async function main() {
  let fxRoot: string, checkpointManager: string;

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 1) {
    // Ethereum Mainnet
    fxRoot = config.mainnet.fxRoot.address;
    checkpointManager = config.mainnet.checkpointManager.address;
  } else if (network.chainId === 5) {
    // Goerli Testnet
    fxRoot = config.testnet.fxRoot.address;
    checkpointManager = config.testnet.checkpointManager.address;
  } else {
    throw new Error("Invalid network");
  }

  const state = await deploy("XStateRootTunnel", [checkpointManager, fxRoot]);
  await state.deployed();
  console.log("StateRootTunnel deployed to:", state.address);
  await verify(network.name, state.address, checkpointManager, fxRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
