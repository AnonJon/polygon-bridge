require("dotenv").config();
import config from "../../config/network.config.json";
import { ethers } from "hardhat";
import FxStateChildTunnel from "../../artifacts/contracts/stateTransfer/StateChildTunnel.sol/FxStateChildTunnel.json";
import FxStateRootTunnel from "../../artifacts/contracts/stateTransfer/StateRootTunnel.sol/FxStateRootTunnel.json";

const fxERC20ChildTunnel = config.testnet.childTunnel.address;
const fxERC20RootTunnel = config.testnet.rootTunnel.address;
const pk = process.env.PRIVATE_KEY as string;

async function main() {
  const signer = new ethers.Wallet(pk, ethers.provider);

  const network = await ethers.provider.getNetwork();

  if (network.chainId === 80001) {
    // Mumbai Testnet
    const childTunnel = new ethers.Contract(
      fxERC20ChildTunnel,
      FxStateChildTunnel.abi,
      signer
    );
    const setERC20Child = await childTunnel.setFxRootTunnel(fxERC20RootTunnel);
    console.log(setERC20Child);
    await setERC20Child.wait();
    console.log("ERC20ChildTunnel set");
  } else if (network.chainId === 5) {
    // Goerli Testnet
    const rootTunnel = new ethers.Contract(
      fxERC20RootTunnel,
      FxStateRootTunnel.abi,
      signer
    );
    const setERC20Root = await rootTunnel.setFxChildTunnel(fxERC20ChildTunnel);
    console.log(setERC20Root);
    await setERC20Root.wait();
    console.log("ERC20RootTunnel set");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
