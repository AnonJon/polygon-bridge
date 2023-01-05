// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@maticnetwork/fx-portal/contracts/lib/ERC20.sol";

import "../interfaces/IERC677Receiver.sol";

contract ERC677 is ERC20 {
    function transferAndCall(address _to, uint256 _value, bytes memory _data) public returns (bool) {
        super.transfer(_to, _value);
        if (isContract(_to)) {
            contractFallback(msg.sender, _to, _value, _data);
        }
        return true;
    }

    function transferAndCallFrom(address _sender, address _to, uint256 _value, bytes memory _data)
        internal
        returns (bool)
    {
        _transfer(_sender, _to, _value);
        if (isContract(_to)) {
            contractFallback(_sender, _to, _value, _data);
        }
        return true;
    }

    function contractFallback(address _sender, address _to, uint256 _value, bytes memory _data) internal {
        IERC677Receiver receiver = IERC677Receiver(_to);
        receiver.onTokenTransfer(_sender, _value, _data);
    }

    function isContract(address _addr) internal view returns (bool hasCode) {
        uint256 length;
        assembly {
            length := extcodesize(_addr)
        }
        return length > 0;
    }
}
