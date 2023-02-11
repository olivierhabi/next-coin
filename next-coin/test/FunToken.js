const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

const sinon = require("sinon");
const sinonStubPromise = require("sinon-stub-promise");

sinonStubPromise(sinon);

describe("FunToken", function () {
  let token;
  let asset;
  let depositAmount;
  let amountDeposit = 40;
  let tranferAmount;
  let testAddress = "0x04cA0214f93dCC632010B9Cf24192A8720Ab0194";

  async function runEverytime() {
    const [owner] = await ethers.getSigners();
    const MyFunToken = await ethers.getContractFactory("FunToken");
    const myFunToken = await MyFunToken.deploy();

    return { myFunToken, owner };
  }
  describe("Deployment", async function () {
    it("Should have a total supply of 10^21 tokens", async function () {
      const { myFunToken } = await loadFixture(runEverytime);
      const rewardDistribution = await myFunToken.rewardDistribution();
      expect(rewardDistribution).to.equal(BigInt(10000000000000000000000));
    });

    it("Should only allow multiples of 10 token deposits", async function () {
      depositAmount = 19;
      const { myFunToken } = await loadFixture(runEverytime);
      await expect(myFunToken.deposit(depositAmount)).to.be.revertedWith(
        "Deposit must be in multiples of 10"
      );
    });

    it("Should only allow to spend amount of token you have", async function () {
      depositAmount = 1000000;
      const { myFunToken } = await loadFixture(runEverytime);
      await expect(
        myFunToken.deposit(Web3.utils.toWei(depositAmount.toString()))
      ).to.be.revertedWith("Not enough token provided");
    });
    it("Should only deposit amount of token", async function () {
      depositAmount = 20;
      const { myFunToken } = await loadFixture(runEverytime);
      await expect(
        myFunToken.deposit(Web3.utils.toWei(depositAmount.toString()))
      ).not.to.be.reverted;
    });

    it("Should only transfer amount of token", async function () {
      tranferAmount = 20;
      const { myFunToken } = await loadFixture(runEverytime);
      await expect(myFunToken.transfer(testAddress, tranferAmount)).not.to.be
        .reverted;
    });

    it("Should only distribute reward to asset owners", async function () {
      const { myFunToken } = await loadFixture(runEverytime);
      myFunToken.deposit(depositAmount);
      await expect(await myFunToken.distributeRewards()).not.to.be.reverted;
    });

    it("Should only claim a your reward and get your all your token back", async function () {
      depositAmount = 20;
      const { myFunToken, owner } = await loadFixture(runEverytime);
      await myFunToken.deposit(Web3.utils.toWei(depositAmount.toString()));
      await myFunToken.distributeRewards();
      await expect(myFunToken.claimReward()).not.to.be.reverted;
    });
  });
});
