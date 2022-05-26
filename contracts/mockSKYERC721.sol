// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
contract MockSKYNFT is ERC721Upgradeable, OwnableUpgradeable {

    function initialize(string memory name, string memory symbol) public initializer {
        __Ownable_init();
        __ERC721_init(name,symbol);
    }

    function mintTokens(address _to, uint id) external {
        _mint(_to,id);
    }
}
