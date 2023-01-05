import { deploy } from "../../test/utils/helpers";

async function main() {
  const name = "Alpha";
  const symbol = "ABC";
  const erc20 = await deploy("Token", [name, symbol]);
  await erc20.deployed();

  console.log(`ERC20 deployed to ${erc20.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
