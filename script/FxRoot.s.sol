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
        Fxroot fxRoot;
        CheckPointManager checkpointManager;
        FxERC20 fxERC20;
    }
    struct Fxroot {
        address Address;
    }
    struct CheckPointManager {
        address Address;
    }
    struct FxERC20 {
        address Address;
    }
    
    function setUp() public {
    
        
    }

    function run() public {
        TestNet memory rawTxDetail = abi.decode(transactionDetails, (TestNet));
        rootTunnel = new FxERC20RootTunnel(rawTxDetail.checkpointManager.Address, rawTxDetail.fxRoot.Address, rawTxDetail.fxERC20.Address);
        console2.log("address is ", address(rootTunnel));
        rootTunnel.setFxChildTunnel(rawTxDetail.fxERC20.Address);

        // vm.broadcast();
        // string memory url = vm.rpcUrl("goerli");
    }
}
