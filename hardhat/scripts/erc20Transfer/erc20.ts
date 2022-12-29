import { deploy } from "../../test/utils/helpers";

async function main() {
  const erc20 = await deploy("Token", ["Jon Token", "Jon"]);
  await erc20.deployed();

  console.log(`ERC20 deployed to ${erc20.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
