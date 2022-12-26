-include .env

install: clean
	forge install --no-git Openzeppelin/openzeppelin-contracts foundry-rs/forge-std fx-portal/contracts --no-commit

script-mumbai:
	forge script scripts/FxChild.s.sol:ChildScript --rpc-url ${MUMBAI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${POLYSCAN_KEY} -vvvv
script-goerli:
	forge script scripts/FxRoot.s.sol:RootScript --rpc-url ${GOERLI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv
script-erc20:
	forge script scripts/ERC20.s.sol:ERC20script --rpc-url ${GOERLI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv

clean:
	remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"