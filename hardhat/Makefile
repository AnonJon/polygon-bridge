-include .env

test-contracts: 
	npx hardhat test --show-stack-traces

run-deposit:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/erc20Transfer/deposit.ts

run-withdraw:
	npx hardhat run --network ${NETWORK_MUMBAI} scripts/erc20Transfer/withdraw.ts

deploy-erc20:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/erc20Transfer/erc20.ts

deploy-childTunnel:
	npx hardhat run --network ${NETWORK_MUMBAI} scripts/erc20Transfer/deployChildTunnel.ts

deploy-rootTunnel:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/erc20Transfer/deployRootTunnel.ts

deploy-rootTunnel:
	npx hardhat run --network ${NETWORK_GOERLI} scripts/erc20Transfer/deployRootTunnel.ts

deploy-setTunnels:
	npx hardhat run --network goerli scripts/erc20Transfer/setTunnels.ts
	npx hardhat run --network mumbai scripts/erc20Transfer/setTunnels.ts

deploy-stateChildTunnel:
	npx hardhat run --network mumbai scripts/stateTransfer/deployChildTunnel.ts