// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "forge-std/console2.sol";

import "forge-std/Test.sol";
import "forge-std/StdJson.sol";
// import "../src/Counter.sol";

contract CounterTest is Test {
    using stdJson for string;
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

    function test_file() public {
        Config memory rawTxDetail = abi.decode(transactionDetails, (Config));
        console2.log(rawTxDetail.fxChild);
        // vm.broadcast();
        // string memory url = vm.rpcUrl("goerli");
    }
}
