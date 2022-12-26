// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "../contracts/FxERC20ChildTunnel.sol";

contract ChildScript is Script {
    using stdJson for string;
    FxERC20ChildTunnel childTunnel;
    address fxChild;
    bytes transactionDetails;
    struct Config {
        address fxChild;
    }
    
    function setUp() public {
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/network.config.json");
        string memory json = vm.readFile(path);
        transactionDetails = json.parseRaw(".testnet.fxChild");
        
    }

    function run() public {
        Config memory rawTxDetail = abi.decode(transactionDetails, (Config));
        childTunnel = new FxERC20ChildTunnel(rawTxDetail.fxChild, address(this));
        console2.log("address is ", address(childTunnel));

        // vm.broadcast();
        // string memory url = vm.rpcUrl("goerli");
    }
}
