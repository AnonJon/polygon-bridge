import { POSClient, use, setProofApi } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";
import { ethers } from "hardhat";
require("dotenv").config();
use(Web3ClientPlugin);
setProofApi("https://apis.matic.network/"); // set proof api
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL as string;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
const privateKey = process.env.PRIVATE_KEY as string;
const parentProvider = new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL);
const childProvider = new ethers.providers.JsonRpcProvider(
  POLYGON_MUMBAI_RPC_URL
);

export const createClient = async (network: string, version: string) => {
  const posClient = new POSClient();
  const client = await posClient.init({
    log: true,
    network: network,
    version: version,
    child: {
      provider: new ethers.Wallet(privateKey, childProvider),
      defaultConfig: {
        from: "",
      },
    },
    parent: {
      provider: new ethers.Wallet(privateKey, parentProvider),
      defaultConfig: {
        from: "",
      },
    },
  });
  return client;
};
