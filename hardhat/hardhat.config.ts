import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL as string;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
const BINANCE_MAINNET_RPC_URL = process.env.BINANCE_MAINNET_RPC_URL as string;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL as string;
const GANACHE_RPC_URL = process.env.GANACHE_RPC_URL as string;
const LOCAL_RPC_URL = process.env.RPC_URL as string;
const PRIVATE_KEY = (process.env.PRIVATE_KEY as string) || "0x";
interface Config extends HardhatUserConfig {
}

const config: Config = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    // ganache: {
    //   url: GANACHE_RPC_URL,
    // },
    hardhat: {
      // // comment out forking to run tests on a local chain
    },
    // mainnet: {
    //   url: MAINNET_RPC_URL,
    //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    //   chainId: 1,
    // },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 5,
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001,
    },
    // binance: {
    //   url: BINANCE_MAINNET_RPC_URL,
    //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    //   chainId: 56,
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  }
};

export default config;
