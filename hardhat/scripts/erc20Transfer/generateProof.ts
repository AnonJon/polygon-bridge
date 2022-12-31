import { createClient } from "../posClient";

async function main() {
  const client = await createClient("testnet", "mumbai");
  const hash: string =
    "0x0f46630def7b2935cfd3f781a43f65bc8379b09a5dd0cd4010d9f43af4fa5567";
  const eventSig: string =
    "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036"; // MessageSent(bytes)
  const proof = await client.exitUtil.buildPayloadForExit(hash, eventSig, true);
  console.log(proof);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
