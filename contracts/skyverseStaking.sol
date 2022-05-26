// SPDX-License-Identifier: None
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./skySigner.sol";
import "./interfaces/IskyToken.sol";

contract SkyVerseStaking is ReentrancyGuardUpgradeable, OwnableUpgradeable, IERC721ReceiverUpgradeable, SkySigner {

    IskyToken skyToken;
    IERC721Upgradeable skyNFT;

    struct stakeInfo {
        address owner;
        uint lastClaim;
        uint position;
        uint stakeTime;
    }

    address designatedSigner;
    uint public claimLock;
    uint[] public rarityBonus;
    uint[] public rewardPercentage;
    uint[] public rewardDays;

    mapping(uint => stakeInfo) public tokenInfo;
    mapping(address => uint[]) public userStaked;
    mapping(uint => uint) public tokenRarity;
    mapping(uint => bool) public isInitialized;

    function getChainId() external view returns(uint) {
        uint id = block.chainid;
        return id;
    }

    function initialize(address _token, address _nft, address _designatedSigner, string memory singerDomain, string memory version) public initializer {
        __ReentrancyGuard_init();
        __Ownable_init();
        __SkyVerseSigner_init(singerDomain, version);
        if(_token != address(0)){
            skyToken = IskyToken(_token);
        }
        if(_nft != address(0)){
            skyNFT = IERC721Upgradeable(_nft);
        }
        if(_designatedSigner != address(0)){
            designatedSigner = _designatedSigner;
        }

        rarityBonus = [1000 ether, 1500 ether, 2000 ether, 3000 ether];
        rewardPercentage = [10, 20, 40, 70, 100];
        rewardDays = [7 days, 14 days, 31 days, 62 days, 93 days];
        claimLock = 1 days;
    }

    //////////////////////////////
    ///@dev Main functionality///
    ////////////////////////////

    function initializeRarity(Rarity[] memory rarities) external {
        uint length = rarities.length;
        for(uint i = 0; i < length; i++) {
            require(!isInitialized[rarities[i].tokenId], "Already Initialized");
            require(getSigner(rarities[i]) == designatedSigner, "Invalid signature");
            tokenRarity[rarities[i].tokenId] = rarities[i].rarity;
            isInitialized[rarities[i].tokenId] = true;
        }
    }

    function stakeNFTs(uint[] memory _tokenIds) external nonReentrant{
        uint length = _tokenIds.length;
        for(uint i = 0; i < length; i++) {
            require(skyNFT.ownerOf(_tokenIds[i]) == _msgSender(), "Sender not Owner");
            require(isInitialized[_tokenIds[i]],"Rarity not initialized");
            tokenInfo[_tokenIds[i]] = stakeInfo(_msgSender(),
                block.timestamp, userStaked[_msgSender()].length, block.timestamp);
            userStaked[_msgSender()].push(_tokenIds[i]);
            skyNFT.transferFrom(_msgSender(), address(this), _tokenIds[i]);
        }
    }

    function claimRewardsAndUnStakeNFTs(uint[] memory _tokenIds) external {
        claimRewards(_tokenIds);
        uint length = _tokenIds.length;
        for(uint i = 0; i < length; i++){
            require(tokenInfo[_tokenIds[i]].owner == _msgSender(),"Sender not owner");
            skyNFT.transferFrom(address(this), _msgSender(), _tokenIds[i]);
            popToken(_tokenIds[i]);
            delete tokenInfo[_tokenIds[i]];
        }
    }

    function claimRewards(uint[] memory _tokenIds) public nonReentrant {
        uint amount;
        uint length = _tokenIds.length;
        for(uint i = 0; i < length; i++){
            require(tokenInfo[_tokenIds[i]].owner == _msgSender(), "Sender not Owner");
            amount += getRewards(_tokenIds[i]);
            tokenInfo[_tokenIds[i]].lastClaim = block.timestamp;
        }
        require(amount > 0, "Not allowed");
        skyToken.mintExactToken(_msgSender(), amount);
    }

    function getRewards(uint _tokenId) public view returns(uint){
        stakeInfo storage info = tokenInfo[_tokenId];
        if(info.lastClaim == 0){
            return 0;
        }
        uint collected = 0;
        uint timeInDays = (block.timestamp - info.lastClaim)/claimLock;
        collected += timeInDays * rarityBonus[tokenRarity[_tokenId]];
        uint bonusAdded = bonusReward(info.stakeTime, collected);
        collected += bonusAdded;
        return collected;
    }

    ////////////////////////////
    ///@dev Private function///
    //////////////////////////

    function bonusReward(uint _stakeTime, uint _collected) private view returns(uint){
        uint bonus = 0;
        uint time = block.timestamp - _stakeTime;
        uint lastIndex = rewardDays.length - 1;
        if(time >= rewardDays[lastIndex]){
            bonus = (_collected * rewardPercentage[lastIndex]) / 100;
        }
        else if(time >= rewardDays[lastIndex - 1]){
            bonus = (_collected * rewardPercentage[lastIndex - 1]) / 100;
        }
        else if(time >= rewardDays[lastIndex - 2]){
            bonus = (_collected * rewardPercentage[lastIndex - 2]) / 100;
        }
        else if(time >= rewardDays[lastIndex - 3]){
            bonus = (_collected * rewardPercentage[lastIndex - 3]) / 100;
        }
        else if(time >= rewardDays[lastIndex - 4]){
            bonus = (_collected * rewardPercentage[lastIndex - 4]) / 100;
        }
        return bonus;
    }

    function popToken(uint tokenId) private {
        uint lastToken = userStaked[_msgSender()][userStaked[_msgSender()].length-1];
        uint currPosition = tokenInfo[tokenId].position;
        userStaked[_msgSender()][currPosition] = lastToken;
        tokenInfo[lastToken].position = currPosition;
        userStaked[_msgSender()].pop();
    }

    ///////////////////
    ///@dev Setters///
    /////////////////

    function setDesignatedSigner(address _newSigner) external onlyOwner{
        require(_newSigner != address(0), "Invalid Address");
        designatedSigner = _newSigner;
    }

    function setRarityBonus(uint[] memory _newBonus) external onlyOwner {
        require(rarityBonus.length == _newBonus.length, "Length Mismatch");
        rarityBonus = _newBonus;
    }

    function setRewardPercentage(uint[] memory _newReward) external onlyOwner {
        require(rewardPercentage.length == _newReward.length, "Length Mismatch");
        rewardPercentage = _newReward;
    }

    function setRewardDays(uint[] memory _newDays) external onlyOwner {
        require(rewardDays.length == _newDays.length, "Length Mismatch");
        rewardDays = _newDays;
    }

    function setClaimLockPeriod(uint _seconds) external onlyOwner{
        claimLock = _seconds;
    }

    ///////////////////
    ///@dev Helpers///
    /////////////////

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external virtual override returns (bytes4){
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }

    function getUserStakedTokens(address _user) external view returns(uint[] memory){
        return userStaked[_user];
    }

}
