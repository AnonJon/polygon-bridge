import { deploy } from "../../test/utils/helpers";

async function main() {
  const template = await deploy("FxERC20");
  await template.deployed();

  console.log(`xERC20 deployed to ${template.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
