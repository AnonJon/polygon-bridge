-include .env

install: clean
	forge install Openzeppelin/openzeppelin-contracts foundry-rs/forge-std fx-portal/contracts --no-commit

script:
	forge script scripts/Counter.s.sol --rpc-url ${RINKEBY_RPC_URL}  --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv

clean:
	remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"