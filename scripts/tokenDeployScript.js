
const hre = require("hardhat");

async function main() {

    const token = await hre.ethers.getContractFactory("MockSKY");
    const rewardToken = await hre.upgrades.deployProxy(token,["MockSky", "SKY"], {initializer:"initialize"});
    await rewardToken.deployed();
    console.log("ERC20Token Contract deployed at:-", rewardToken.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
