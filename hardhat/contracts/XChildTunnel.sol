// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {FxBaseChildTunnel} from "@maticnetwork/fx-portal/contracts/tunnel/FxBaseChildTunnel.sol";
import {IFxERC20} from "@maticnetwork/fx-portal/contracts/tokens/IFxERC20.sol";
import {Clone} from "./lib/Clone.sol";
import "hardhat/console.sol";

/**
 * @title XChildTunnel
 */
contract XChildTunnel is FxBaseChildTunnel, Clone {
    bytes32 public constant DEPOSIT = keccak256("DEPOSIT");
    bytes32 public constant MAP_TOKEN = keccak256("MAP_TOKEN");
    string public constant SUFFIX_NAME = " (xERC677)";
    string public constant PREFIX_SYMBOL = "x";
    address public immutable tokenTemplate;
    mapping(address => address) public rootToChildToken;

    event TokenMapped(address indexed rootToken, address indexed childToken);
    event TokenDeposted(
        address indexed rootToken, address indexed depositor, address indexed user, uint256 amount, bytes data
    );

    constructor(address _fxChild, address _tokenTemplate) FxBaseChildTunnel(_fxChild) {
        tokenTemplate = _tokenTemplate;
        require(_isContract(_tokenTemplate), "Token template is not contract");
    }

    function withdraw(address childToken, uint256 amount) public {
        _withdraw(childToken, msg.sender, amount);
    }

    function withdrawTo(address childToken, address receiver, uint256 amount) public {
        _withdraw(childToken, receiver, amount);
    }

    function _processMessageFromRoot(
        uint256,
        /* stateId */
        address sender,
        bytes memory data
    ) internal override validateSender(sender) {
        (bytes32 syncType, bytes memory syncData) = abi.decode(data, (bytes32, bytes));

        if (syncType == DEPOSIT) {
            _syncDeposit(syncData);
        } else if (syncType == MAP_TOKEN) {
            _mapToken(syncData);
        } else {
            revert("XChildTunnel: INVALID_SYNC_TYPE");
        }
    }

    function _mapToken(bytes memory syncData) internal {
        (address rootToken, string memory name, string memory symbol, uint8 decimals) =
            abi.decode(syncData, (address, string, string, uint8));

        address childToken = rootToChildToken[rootToken];
        require(childToken == address(0x0), "XChildTunnel: ALREADY_MAPPED");

        // deploy new child token
        bytes32 salt = keccak256(abi.encodePacked(rootToken));
        childToken = createClone(salt, tokenTemplate);

        IFxERC20(childToken).initialize(
            address(this),
            rootToken,
            string(abi.encodePacked(name, SUFFIX_NAME)),
            string(abi.encodePacked(PREFIX_SYMBOL, symbol)),
            decimals
        );

        rootToChildToken[rootToken] = childToken;
        emit TokenMapped(rootToken, childToken);
    }

    function _syncDeposit(bytes memory syncData) internal {
        (address rootToken, address depositor, address to, uint256 amount, bytes memory depositData) =
            abi.decode(syncData, (address, address, address, uint256, bytes));
        address childToken = rootToChildToken[rootToken];

        // deposit tokens
        IFxERC20 childTokenContract = IFxERC20(childToken);
        childTokenContract.mint(to, amount);

        if (_isContract(to)) {
            uint256 txGas = 2000000;
            bool success = false;
            bytes memory data = abi.encodeWithSignature(
                "onTokenTransfer(address,address,address,address,uint256,bytes)",
                rootToken,
                childToken,
                depositor,
                to,
                amount,
                depositData
            );
            assembly {
                success := call(txGas, to, 0, add(data, 0x20), mload(data), 0, 0)
            }
        }
        emit TokenDeposted(rootToken, depositor, to, amount, depositData);
    }

    function _withdraw(address childToken, address receiver, uint256 amount) internal {
        IFxERC20 childTokenContract = IFxERC20(childToken);
        address rootToken = childTokenContract.connectedToken();
        require(
            childToken != address(0x0) && rootToken != address(0x0) && childToken == rootToChildToken[rootToken],
            "FxERC20ChildTunnel: NO_MAPPED_TOKEN"
        );

        childTokenContract.burn(msg.sender, amount);

        _sendMessageToRoot(abi.encode(rootToken, childToken, receiver, amount));
    }

    function _isContract(address _addr) private view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }
}
