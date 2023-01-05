import XERC20RootTunnel from "../../artifacts/contracts/XERC20RootTunnel.sol/XERC20RootTunnel.json";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import config from "../../config/network.config.json";
import { createClient } from "../posClient";
import { POSClient } from "@maticnetwork/maticjs";
require("dotenv").config();

const pk = process.env.PRIVATE_KEY as string;
const amount = ethers.utils.parseEther("10"); // the amount you want to withdraw
const user: string = config.testnet.localUser.address; // address recieving tokens on the other side
const main = async () => {
  const signer = new ethers.Wallet(pk, ethers.provider);
  const network = await ethers.provider.getNetwork();
  let token: string;
  let hash: string;
  let client: POSClient;
  let check: boolean = false;
  let rootTunnel: Contract;
  let rootTunnelAddress: string;

  if (network.chainId === 5) {
    // Goerli Testnet
    rootTunnelAddress = config.testnet.rootTunnel.address;
    token = config.testnet.ERC677.address;
    rootTunnel = new ethers.Contract(
      rootTunnelAddress,
      XERC20RootTunnel.abi,
      signer
    );
    client = await createClient("testnet", "mumbai");
  } else if (network.chainId === 1) {
    // Ethereum Mainnet
    rootTunnelAddress = config.mainnet.rootTunnel.address;
    token = config.mainnet.ERC677.address;
    rootTunnel = new ethers.Contract(
      rootTunnelAddress,
      XERC20RootTunnel.abi,
      signer
    );
    client = await createClient("mainnet", "v1");
  } else {
    console.log("Wrong Network");
    return;
  }
  const depositAssets = await rootTunnel.deposit(token, user, amount, "0x00");
  console.log(depositAssets);
  hash = depositAssets.hash;
  await depositAssets.wait();
  console.log("Assets deposited");
  console.log("Waiting for checkpoint to be reached...\n");
  while (!check) {
    const isDeposited = await client.isDeposited(
      hash // tx id
    );
    if (!isDeposited) {
      await new Promise((r) => setTimeout(r, 120000));
    } else {
      check = true;
    }
  }
  console.log("Tokens deposited!");
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
