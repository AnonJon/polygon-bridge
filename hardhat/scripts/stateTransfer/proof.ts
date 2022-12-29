import { POSClient } from "@maticnetwork/maticjs";

import { ethers } from "hardhat";
require("dotenv").config();

const main = async () => {
  const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL as string;
  const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
  const pk = process.env.PRIVATE_KEY as string;
  const signer = new ethers.Wallet(pk, ethers.provider);
  const getPOSClient = async (network: string, version: string) => {
    const posClient = new POSClient();
    const client = await posClient.init({
      log: true,
      network: network,
      version: version,
      child: {
        provider: new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_RPC_URL),
        defaultConfig: {
          from: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        },
      },
      parent: {
        provider: new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL),
        defaultConfig: {
          from: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        },
      },
    });
    return client;
  };
  const posClient = await getPOSClient("testnet", "mumbai");
  const proof = await posClient.exitUtil.buildPayloadForExit(
    "0xee1e40e259a31ce23158dc803d10690bea7acc9b8203493532fdb1b44d0b7721",
    "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036",
    true
  );
  console.log(proof);
};
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
