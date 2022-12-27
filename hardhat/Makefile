-include .env

deploy-erc20:
	npx hardhat run --network ${NETWORK} scripts/erc20.ts

deploy-childTunnel:
	npx hardhat run --network ${NETWORK} scripts/deployChildTunnel.ts

deploy-rootTunnel:
	npx hardhat run --network ${NETWORK} scripts/deployRootTunnel.ts