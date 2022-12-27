// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contracts/ERC20.sol";

contract ERC20script is Script {
    Token token;

    function setUp() public {}

    function run() public {
        vm.broadcast();
        token = new Token("Jon Token", "JON");
        console2.log("address is ", address(token));
    }
}
