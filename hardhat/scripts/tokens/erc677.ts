import { deploy, verify } from "../../test/utils/helpers";
import { network } from "hardhat";

async function main() {
  const name = "Alpha";
  const symbol = "ABC";
  const supply = "100000000000000000000000000";
  const erc677 = await deploy("ERC677_Token", [name, symbol, supply]);
  await erc677.deployed();

  console.log(`ERC677 deployed to ${erc677.address}`);
  await verify(network.name, erc677.address, name, symbol, supply);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
