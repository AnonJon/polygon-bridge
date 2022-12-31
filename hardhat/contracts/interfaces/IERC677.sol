// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@maticnetwork/fx-portal/contracts/lib/IERC20.sol";

interface IERC677 is IERC20 {
    function transferAndCall(address _to, uint256 _value, bytes calldata _data) external returns (bool success);
}
