// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
contract MockSKY is ERC20Upgradeable, OwnableUpgradeable {

    mapping (address => bool) public onlyMinter;

    function initialize (string memory tokenName, string memory tokenSymbol) public initializer {
        __ERC20_init(tokenName, tokenSymbol);
        __Ownable_init();
    }

    function setMinter (address _minter) external onlyOwner {
        onlyMinter[_minter] = true;
    }

    function mintExactToken (address _to, uint _amount) external {
        require (onlyMinter[msg.sender],'!Allowed');
        _mint(_to, _amount);
    }
}