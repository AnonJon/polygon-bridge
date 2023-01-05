// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../interfaces/IxERC677.sol";
import "./ERC677_Template.sol";

contract XERC677 is ERC677 {
    address internal _fxManager;
    address internal _connectedToken;

    function initialize(
        address manager,
        address connectedToken_,
        string memory name,
        string memory symbol,
        uint8 decimals
    ) public {
        require(_fxManager == address(0x0) && _connectedToken == address(0x0), "Token is already initialized");
        _fxManager = manager;
        _connectedToken = connectedToken_;

        // setup meta data
        setupMetaData(name, symbol, decimals);
    }

    // fxManager returns fx manager
    function fxManager() public view returns (address) {
        return _fxManager;
    }

    // connectedToken returns root token
    function connectedToken() public view returns (address) {
        return _connectedToken;
    }

    // setup name, symbol and decimals
    function setupMetaData(string memory _name, string memory _symbol, uint8 _decimals) public {
        require(msg.sender == _fxManager, "Invalid sender");
        _setupMetaData(_name, _symbol, _decimals);
    }

    function mint(address user, uint256 amount) public {
        require(msg.sender == _fxManager, "Invalid sender");
        _mint(user, amount);
    }

    function burn(address user, uint256 amount) public {
        require(msg.sender == _fxManager, "Invalid sender");
        _burn(user, amount);
    }
}
