-include .env

test-contracts: 
	npx hardhat test --show-stack-traces

generate-proof:
	npx hardhat run --network ${NETWORK_MUMBAI} scripts/erc20Transfer/generateProof.ts

run-deposit:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/erc20Transfer/deposit.ts

run-withdraw:
	npx hardhat run --network ${NETWORK_MUMBAI} scripts/erc20Transfer/withdraw.ts

deploy-erc20:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/tokens/erc20.ts

deploy-erc677:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/tokens/erc677.ts

deploy-childTunnel:
	npx hardhat run --network ${NETWORK_MUMBAI} scripts/erc20Transfer/deployChildTunnel.ts

deploy-rootTunnel:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/erc20Transfer/deployRootTunnel.ts

deploy-erc677-template:
	npx hardhat run --network ${NETWORK_MUMBAI} scripts/tokens/xERC677.ts


# state transfer
setTunnels:
	npx hardhat run --network goerli scripts/erc20Transfer/setTunnels.ts
	npx hardhat run --network mumbai scripts/erc20Transfer/setTunnels.ts

deploy-stateChildTunnel:
	npx hardhat run --network mumbai scripts/stateTransfer/deployChildTunnel.ts