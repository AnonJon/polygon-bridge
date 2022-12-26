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

    struct TestNet {
        address checkpointManager;
        address childTunnel;
        address fxChild;
        address fxERC20;
        address fxRoot;
    }

    function setUp() public {
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/network.config.json");
        string memory json = vm.readFile(path);
        transactionDetails = json.parseRaw(".testnet");
    }

    function run() public {
        vm.broadcast();
        TestNet memory rawTxDetail = abi.decode(transactionDetails, (TestNet));
        childTunnel = new FxERC20ChildTunnel(rawTxDetail.fxChild, rawTxDetail.fxERC20);
        console2.log("address is ", address(childTunnel));
    }
}
