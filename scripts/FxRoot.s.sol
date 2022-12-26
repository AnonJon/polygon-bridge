// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "../contracts/FxERC20RootTunnel.sol";

contract RootScript is Script {
    using stdJson for string;

    string root = vm.projectRoot();
    string path = string.concat(root, "/network.config.json");
    string json = vm.readFile(path);
    FxERC20RootTunnel rootTunnel;
    bytes transactionDetails = json.parseRaw(".testnet");

    struct TestNet {
        address checkpointManager;
        address childTunnel;
        address fxChild;
        address fxERC20;
        address fxRoot;
    }

    function setUp() public {}

    function run() public {
        vm.broadcast();
        TestNet memory rawTxDetail = abi.decode(transactionDetails, (TestNet));
        rootTunnel = new FxERC20RootTunnel(rawTxDetail.checkpointManager, rawTxDetail.fxRoot, rawTxDetail.fxERC20);
        console2.log("address is ", address(rootTunnel));
        rootTunnel.setFxChildTunnel(rawTxDetail.childTunnel);
        console2.log("ERC20ChildTunnel set");
    }
}
