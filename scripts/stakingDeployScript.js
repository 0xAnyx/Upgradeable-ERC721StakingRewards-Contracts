const hre = require("hardhat");
async function main() {

    const stake = await hre.ethers.getContractFactory("SkyVerseStaking");
    // const staking = await hre.upgrades.upgradeProxy("0xd65C255D917247CB04aea04C690B590507f004e3", stake);
    const staking = await hre.upgrades.deployProxy(stake, ["0x85bAFEB8A996Fc5F272923Ecc33378d51eaA9797",
        "0xaA00108B7d2dE34C2f77ABF30e4EA029580c1372",
        "0x79BF6Ab2d78D81da7d7E91990a25A81e93724a60", "SkyVerse-Staking", "1"]);

    await staking.deployed();
    console.log("Staking Contract deployed at:-", staking.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
