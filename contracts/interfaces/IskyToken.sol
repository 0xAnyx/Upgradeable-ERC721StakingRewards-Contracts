// SPDX-License-Identifier: None

pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IskyToken is IERC20Upgradeable{
    function mintExactToken (address _to, uint _amount) external;
}
