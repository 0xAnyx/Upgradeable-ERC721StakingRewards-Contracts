
const hre = require("hardhat");

async function main() {

    const nft = await hre.ethers.getContractFactory("MockSKYNFT");
    const skyToken = await hre.upgrades.deployProxy(nft,["Skyverse","SKY"], {initializer:"initialize"});
    await skyToken.deployed();
    console.log("NFT Contract deployed at:-", skyToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
