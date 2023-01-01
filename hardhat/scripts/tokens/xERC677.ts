import { deploy, verify } from "../../test/utils/helpers";
import { network } from "hardhat";

async function main() {
  const template = await deploy("XERC677");
  await template.deployed();

  console.log(`xERC677 deployed to ${template.address}`);
  await verify(network.name, template.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
