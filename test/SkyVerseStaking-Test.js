const { expect } = require('chai');
const {ethers, upgrades} = require ('hardhat')
const { utils } = require("ethers");
const { advanceTime, currentTimestamp } = require('./utils')
const Web3 = require ('web3')
const async = require("async");
const {fromWei} = Web3.utils;
// Start test block
describe('Skyverse (proxy)', function () {
    let nft, token, stake, alice, bob
    beforeEach(async function () {
        [alice,bob] = await ethers.getSigners()
        const Nft = await  ethers.getContractFactory('MockSKYNFT')
        const Token = await  ethers.getContractFactory("MockSKY")
        const Stake = await ethers.getContractFactory("SkyVerseStakingMod")
        nft = await upgrades.deployProxy(Nft, ['Skyverse_Nft','SKY'], {initializer:'initialize'})
        token = await upgrades.deployProxy(Token,['Sky_Token','SKY'], {initializer:'initialize'})
        stake = await upgrades.deployProxy(Stake, [token.address, nft.address, alice.address,"Skyverse","1"], {initializer: 'initialize'});
        await stake.deployed()
        // await nft.setAuthorisation(alice.address)
        await nft.mintTokens(alice.address, 1);
        await nft.mintTokens(bob.address, 2);
        await nft.approve(stake.address,1)
        await nft.connect(bob).approve(stake.address,2)
        await token.setMinter(alice.address)
        await token.setMinter(stake.address)
        await token.mintExactToken(stake.address, ethers.utils.parseEther('100000000'))
        console.log("Testing🫡")
    });

    // Test case
    describe ('Staking the tokens in the contract:=😁', async() => {
        it('Staking tokens', async function () {
            await stake.initializeRarity([1], [0]);
            // await nft.connect(alice).approve(stake.address,1)
            // await token.approve(stake.address, (ethers.utils.parseEther('100000000')))
            await stake.connect(alice).stakeNFTs([1])
            expect(await stake.tokenRarity([1])).to.eq(0)
        });
    });
    describe ('Claiming At Different Situations:=😁 ', async() => {
        it ('Claiming after 1 week🫣 "Rarity 1"', async() => {
                await stake.initializeRarity([2],[0])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*7*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal('7700')
        })

        it ('Claiming after 2 week😇 "Rarity 1"', async() => {
                await stake.initializeRarity([2],[0])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*14*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal('16800')
        })

        it ('Claiming after 31 days🤠 "Rarity 1"', async() => {
                await stake.initializeRarity([2],[0])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*31*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal('43400')
        });

        it ('Claiming after 62 days😗 "Rarity 1"', async() => {
                await stake.initializeRarity([2],[0])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*62*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal('105400')
        });

        it ('Claiming after 93 days🤓 "Rarity 1"', async() => {
                await stake.initializeRarity([2],[0])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*93*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal('186000')
        });
        it ('Claiming after 1 week🫣 "Rarity 2"', async() => {
                await stake.initializeRarity([2],[1])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*7*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal('11550')
        })

        it ('Claiming after 2 week😇 "Rarity 2"', async() => {
                await stake.initializeRarity([2],[1])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*14*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((1500*14)+(1500*14)*20/100).toString())
        })

        it ('Claiming after 31 days🤠 "Rarity 2"', async() => {
                await stake.initializeRarity([2],[1])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*31*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((1500*31)+(1500*31)*40/100).toString())
        });

        it ('Claiming after 62 days😗 "Rarity 2"', async() => {
                await stake.initializeRarity([2],[1])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*62*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((1500*62)+(1500*62)*70/100).toString())
        });

        it ('Claiming after 93 days🤓 "Rarity 2"', async() => {
                await stake.initializeRarity([2],[1])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*93*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((1500*93)+(1500*93)*100/100).toString())
        });

        it ('Claiming after 1 week🫣 "Rarity 3" ', async() => {
                await stake.initializeRarity([2],[2])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*7*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((2000*7)+(2000*7)*10/100).toString())
        })

        it ('Claiming after 2 week😇 "Rarity 3"', async() => {
                await stake.initializeRarity([2],[2])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*14*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((2000*14)+(2000*14)*20/100).toString())
        })

        it ('Claiming after 31 days🤠 "Rarity 3"', async() => {
                await stake.initializeRarity([2],[2])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*31*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((2000*31)+(2000*31)*40/100).toString())
        });

        it ('Claiming after 62 days😗 "Rarity 3"', async() => {
                await stake.initializeRarity([2],[2])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*62*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((2000*62)+(2000*62)*70/100).toString())
        });

        it ('Claiming after 93 days🤓 "Rarity 3"', async() => {
                await stake.initializeRarity([2],[2])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*93*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((2000*93)+(2000*93)*100/100).toString())
        });

        it ('Claiming after 1 week🫣 "Rarity 4"', async() => {
                await stake.initializeRarity([2],[3])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*7*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((3000*7)+(3000*7)*10/100).toString())
        })

        it ('Claiming after 2 week😇 "Rarity 4"', async() => {
                await stake.initializeRarity([2],[3])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*14*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((3000*14)+(3000*14)*20/100).toString())
        })

        it ('Claiming after 31 days🤠"Rarity 4"', async() => {
                await stake.initializeRarity([2],[3])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*31*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((3000*31)+(3000*31)*40/100).toString())
        });

        it ('Claiming after 62 days😗 "Rarity 4"', async() => {
                await stake.initializeRarity([2],[3])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*62*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((3000*62)+(3000*62)*70/100).toString())
        });

        it ('Claiming after 93 days🤓 "Rarity 4"', async() => {
                await stake.initializeRarity([2],[3])
                await stake.connect(bob).stakeNFTs([2])
                await network.provider.send("evm_increaseTime", [24*93*3600])
                await stake.connect(bob).claimRewards([2])
                const value2 = await token.balanceOf(bob.address)
                expect (fromWei(value2.toString(),"ether")).to.equal(((3000*93)+(3000*93)*100/100).toString())
        });

        it('Unstaking Tokens', async() =>{
            await stake.initializeRarity([2],[3])
            await stake.connect(bob).stakeNFTs([2])
            await advanceTime(24*3600);
            await stake.connect(bob).claimRewardsAndUnStakeNFTs([2]);
            expect(await nft.ownerOf(2)).to.eq(bob.address);
            expect(await token.balanceOf(bob.address)).to.eq((ethers.utils.parseEther('3000')));
        });

        it('Unstaking Tokens on revert', async() =>{
            await stake.initializeRarity([2],[3])
            await stake.connect(bob).stakeNFTs([2])
            await expect(stake.connect(bob).claimRewardsAndUnStakeNFTs([2])).to.be.revertedWith('Not allowed');
        });

        it ('Claiming after 7 days and un-staking after 24 more days', async()=> {
            await stake.initializeRarity([2],[3])
            await stake.connect(bob).stakeNFTs([2])
            await advanceTime(24*7*3600);
            await stake.connect(bob).claimRewards([2]);
            let first = await token.balanceOf(bob.address)
            expect (fromWei(first.toString(),'ether')).to.equal(((7*3000)+(7*3000)*10/100).toString())
            console.log('First Passed')
            await advanceTime(24*24*3600);
            await stake.connect(bob).claimRewardsAndUnStakeNFTs([2]);
            let second = await token.balanceOf(bob.address)
            expect (fromWei(second.toString(),'ether')).to.equal((((24*3000)+(24*3000)*40/100)+((7*3000)+(7*3000)*10/100)).toString())
        })
    });
});

// describe ('Testing signer', async() =>{
//     let nft,token,stake,alice,bob;
//     before('Setting up', async() =>{
//         [alice,bob] = await ethers.getSigners()
//         const Nft = await  ethers.getContractFactory('MockSKYNFT')
//         const Token = await  ethers.getContractFactory("MockSKY")
//         const Stake = await ethers.getContractFactory("SkyVerseStaking")
//         nft = await upgrades.deployProxy(Nft, ['Skyverse_Nft','SKY'], {initializer:'initialize'})
//         token = await upgrades.deployProxy(Token,['Sky_Token','SKY'], {initializer:'initialize'})
//         stake = await upgrades.deployProxy(Stake, [token.address, nft.address, "0x79BF6Ab2d78D81da7d7E91990a25A81e93724a60"], {initializer: 'initialize'});
//         await stake.deployed()
//         // await nft.setAuthorisation(alice.address)
//         await nft.mintTokens(alice.address, 1);
//         await nft.mintTokens(bob.address, 2);
//         await nft.approve(stake.address,1)
//         await nft.connect(bob).approve(stake.address,2)
//         await token.setMinter(alice.address)
//         await token.mintExactToken(stake.address, ethers.utils.parseEther('100000000'))
//         console.log("Testing🫡")
//     })
//     describe('Creating the signer', async()=>{
//         it ("Starting", async () => {
//             console.log(stake.address)
//                 console.log(await stake.getSigner([2,0,"0x6c1785f07c20a50f2f621a3457bceb0c6161fdc3fcba49cd1a63b9402734d76d284a513daaa5f75892ea7f9b49000cddde34c69d0bd66f18eed5e9d09549a3351c"]))
//                     const val =await stake.getChainId()
//                     console.log(fromWei(val.toString(),'wei'))
//         })
//     })
// })
