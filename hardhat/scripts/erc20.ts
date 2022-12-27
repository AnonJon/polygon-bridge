import { ethers } from "hardhat";
import {deploy} from "../test/util";

async function main() {
  const erc20 = await deploy("Token",["Test Token", "TT"]);
  await erc20.deployed();

  console.log(`ERC20 deployed to ${erc20.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
