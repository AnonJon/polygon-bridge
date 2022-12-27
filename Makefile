-include .env

install: clean
	forge install Openzeppelin/openzeppelin-contracts foundry-rs/forge-std fx-portal/contracts --no-commit

script-mumbai:
	forge script script/FxChild.s.sol:ChildScript --rpc-url ${MUMBAI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${POLYSCAN_KEY} -vvvv
script-goerli:
	forge script script/FxChild.s.sol:ChildScript --rpc-url ${GOERLI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv
script-erc20:
	forge script script/ERC20.s.sol:ERC20script --rpc-url ${GOERLI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv

script-erc20-mumbai:
	forge script script/ERC20.s.sol:ERC20script --rpc-url ${MUMBAI_RPC} --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${POLYSCAN_KEY} -vvvv

clean:
	remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"