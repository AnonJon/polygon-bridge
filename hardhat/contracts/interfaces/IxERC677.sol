// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./IERC677.sol";

interface IxERC677 is IERC677 {
    function fxManager() external returns (address);

    function connectedToken() external returns (address);

    function initialize(
        address _fxManager,
        address _connectedToken,
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) external;

    function mint(address user, uint256 amount) external;

    function burn(address user, uint256 amount) external;
}
