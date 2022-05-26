//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";

contract SkySigner is EIP712Upgradeable{

    string private  SIGNING_DOMAIN; //= "SkyVerse-Staking";
    string private  SIGNATURE_VERSION; //= "1";

    struct Rarity {
        uint tokenId;
        uint8 rarity;
        bytes signature;
    }

    function __SkyVerseSigner_init(string memory domain, string memory version) internal initializer {
        SIGNING_DOMAIN = domain;
        SIGNATURE_VERSION = version;
        __EIP712_init(domain, version);
    }

    function getSigner(Rarity memory result) public view returns(address){
        return _verify(result);
    }

    function _hash(Rarity memory result) internal view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(
                keccak256("Rarity(uint256 tokenId, uint8 rarity)"),
                result.tokenId,
                result.rarity
            )));
    }

    function _verify(Rarity memory result) internal view returns (address) {
        bytes32 digest = _hash(result);
        return ECDSAUpgradeable.recover(digest, result.signature);
    }

}