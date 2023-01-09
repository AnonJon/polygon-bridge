// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@maticnetwork/fx-portal/contracts/lib/ERC20.sol";
import {FxBaseRootTunnel} from "@maticnetwork/fx-portal/contracts/tunnel/FxBaseRootTunnel.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Clone} from "./lib/Clone.sol";

/**
 * @title XRootTunnel
 */
contract XRootTunnel is FxBaseRootTunnel, Clone {
    using SafeERC20 for IERC20;

    bytes32 public constant DEPOSIT = keccak256("DEPOSIT");
    bytes32 public constant MAP_TOKEN = keccak256("MAP_TOKEN");

    event TokenMappedERC20(address indexed rootToken, address indexed childToken, bytes message);
    event FxWithdrawERC20(
        address indexed rootToken, address indexed childToken, address indexed userAddress, uint256 amount
    );
    event FxDepositERC20(
        address indexed rootToken, address indexed depositor, address indexed userAddress, uint256 amount, bytes message
    );

    mapping(address => address) public rootToChildTokens;
    bytes32 public immutable childTokenTemplateCodeHash;

    constructor(address _checkpointManager, address _fxRoot, address _fxERC20Token)
        FxBaseRootTunnel(_checkpointManager, _fxRoot)
    {
        childTokenTemplateCodeHash = keccak256(minimalProxyCreationCode(_fxERC20Token));
    }

    /**
     * @param rootToken address of token on root chain
     */
    function mapToken(address rootToken) public {
        require(rootToChildTokens[rootToken] == address(0x0), "XRootTunnel: ALREADY_MAPPED");

        ERC20 rootTokenContract = ERC20(rootToken);
        string memory name = rootTokenContract.name();
        string memory symbol = rootTokenContract.symbol();
        uint8 decimals = rootTokenContract.decimals();

        bytes memory message = abi.encode(MAP_TOKEN, abi.encode(rootToken, name, symbol, decimals));
        _sendMessageToChild(message);

        bytes32 salt = keccak256(abi.encodePacked(rootToken));
        address childToken = computedCreate2Address(salt, childTokenTemplateCodeHash, fxChildTunnel);

        rootToChildTokens[rootToken] = childToken;
        emit TokenMappedERC20(rootToken, childToken, message);
    }

    function deposit(address rootToken, address user, uint256 amount, bytes memory data) public {
        if (rootToChildTokens[rootToken] == address(0x0)) {
            mapToken(rootToken);
        }

        IERC20(rootToken).safeTransferFrom(
            msg.sender, // depositor
            address(this), // manager contract
            amount
        );

        bytes memory message = abi.encode(DEPOSIT, abi.encode(rootToken, msg.sender, user, amount, data));
        _sendMessageToChild(message);
        emit FxDepositERC20(rootToken, msg.sender, user, amount, message);
    }

    function _processMessageFromChild(bytes memory data) internal override {
        (address rootToken, address childToken, address to, uint256 amount) =
            abi.decode(data, (address, address, address, uint256));
        require(rootToChildTokens[rootToken] == childToken, "FxERC20RootTunnel: INVALID_MAPPING_ON_EXIT");

        IERC20(rootToken).safeTransfer(to, amount);
        emit FxWithdrawERC20(rootToken, childToken, to, amount);
    }
}
