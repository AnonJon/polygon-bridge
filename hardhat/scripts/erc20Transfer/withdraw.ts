require("dotenv").config();
import XERC20ChildTunnel from "../../artifacts/contracts/XERC20ChildTunnel.sol/XERC20ChildTunnel.json";
import XERC20RootTunnel from "../../artifacts/contracts/XERC20RootTunnel.sol/XERC20RootTunnel.json";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import config from "../../config/network.config.json";
import { createClient } from "../posClient";
import { POSClient } from "@maticnetwork/maticjs";

const pk = process.env.PRIVATE_KEY as string;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
const rootProvider = new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL);

const main = async () => {
  const signer = new ethers.Wallet(pk, ethers.provider);
  const signer2 = new ethers.Wallet(pk, rootProvider);
  const network = await ethers.provider.getNetwork();

  const amount = ethers.utils.parseEther("10"); // the amount you want to withdraw
  const eventSig: string =
    "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036"; // MessageSent(bytes)
  let hash: string,
    client: POSClient,
    check: boolean = false,
    rootTunnel: Contract,
    childTunnel: Contract,
    token: string,
    rootTunnelAddress: string,
    childTunnelAddress: string;
  if (network.chainId === 80001) {
    // Mumbai Testnet
    rootTunnelAddress = config.testnet.rootTunnel.address;
    childTunnelAddress = config.testnet.childTunnel.address;
    childTunnel = new ethers.Contract(
      childTunnelAddress,
      XERC20ChildTunnel.abi,
      signer
    );
    rootTunnel = new ethers.Contract(
      rootTunnelAddress,
      XERC20RootTunnel.abi,
      signer2
    );
    token = config.testnet.childToken.address;
    client = await createClient("testnet", "mumbai");
  } else if (network.chainId === 137) {
    // Polygon Mainnet
    rootTunnelAddress = config.mainnet.rootTunnel.address;
    childTunnelAddress = config.mainnet.childTunnel.address;
    childTunnel = new ethers.Contract(
      childTunnelAddress,
      XERC20ChildTunnel.abi,
      signer
    );
    rootTunnel = new ethers.Contract(
      rootTunnelAddress,
      XERC20RootTunnel.abi,
      signer2
    );
    token = config.mainnet.childToken.address;
    client = await createClient("mainnet", "v1");
  } else {
    console.log("Wrong Network");
    return;
  }

  const withdrawAssets = await childTunnel.withdraw(token, amount);
  console.log(withdrawAssets);
  hash = withdrawAssets.hash;
  await withdrawAssets.wait();
  console.log("Assets withdrawn");
  console.log("Waiting for checkpoint to be reached...\n");
  while (!check) {
    const isCheckPointed = await client.isCheckPointed(hash);
    if (!isCheckPointed) {
      await new Promise((r) => setTimeout(r, 30000));
    } else {
      check = true;
    }
  }

  const proof = await client.exitUtil.buildPayloadForExit(hash, eventSig, true);
  console.log(proof);
  await rootTunnel.receiveMessage(proof);
  console.log("Assets withdrawn from root tunnel!");
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
