/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Cryptor } from "../typechain";

describe("Cryptor Token", () => {
  let contract: Cryptor;
  before(async () => {
    const cryptorFactory = await ethers.getContractFactory("Cryptor");
    contract = (await cryptorFactory.deploy(
      42000000000,
      await ethers.provider.getSigner(0).getAddress()
    )) as Cryptor;
    await contract.deployed();
    const address = await ethers.provider.getSigner(1).getAddress();
    const tx = await contract.mint(address, 1000000000);
    await tx.wait(1);
  });

  describe("Owner", () => {
    it("can mint new tokens", async () => {
      const address = await ethers.provider.getSigner(0).getAddress();
      const tx = await contract.mint(address, 10000000000);
      await tx.wait(1);
      expect(await contract.balanceOf(address)).to.be.eq(10000000000);
    });

    it("can grant role", async () => {
      const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
      const address = await ethers.provider.getSigner(1).getAddress();
      const tx = await contract.grantRole(MINTER_ROLE, address);
      await tx.wait(1);
      expect(await contract.hasRole(MINTER_ROLE, address)).to.be.eq(true);
    });

    it("can revoke role", async () => {
      const MINTER_ROLE = ethers.utils.id("MINTER_ROLE");
      const address = await ethers.provider.getSigner(1).getAddress();
      const tx = await contract.revokeRole(MINTER_ROLE, address);
      await tx.wait(1);
      expect(await contract.hasRole(MINTER_ROLE, address)).to.be.eq(false);
    });
  });

  describe("Minter", () => {
    it("can mint new tokens", async () => {
      const address = await ethers.provider.getSigner(2).getAddress();
      const tx = await contract.mint(address, 1000000000);
      await tx.wait(1);
      expect(await contract.balanceOf(address)).to.be.eq(1000000000);
    });

    it("can't mint if not MINTER", async () => {
      const minter = ethers.provider.getSigner(1);
      const address = await ethers.provider.getSigner(1).getAddress();
      const contractAsMinter = contract.connect(minter);
      await expect(
        contractAsMinter.mint(address, 12000000000)
      ).to.be.revertedWith("ERC20MinterPauser: must have minter role to mint");
    });

    it("can't mint more than capped supply", async () => {
      const address = await ethers.provider.getSigner(1).getAddress();
      await expect(contract.mint(address, 42100000000)).to.be.revertedWith(
        "ERC20Capped: cap exceeded"
      );
    });
  });

  describe("Pauser", () => {
    it("can pause the contract", async () => {
      const tx = await contract.pause();
      await tx.wait(1);
      expect(await contract.paused()).to.be.eq(true);
    });

    it("can unpause the contract", async () => {
      const tx = await contract.unpause();
      await tx.wait(1);
      expect(await contract.paused()).to.be.eq(false);
    });

    it("can't pause or unpause if not PAUSER", async () => {
      const nonPauser = ethers.provider.getSigner(2);
      const contractAsNonPauser = contract.connect(nonPauser);
      await expect(contractAsNonPauser.pause()).to.be.revertedWith(
        "ERC20MinterPauser: must have pauser role to pause"
      );
    });
  });

  describe("Token Holder", () => {
    it("can transfer token when unpaused", async () => {
      const holder = ethers.provider.getSigner(1);
      const contractAsHolder = contract.connect(holder);
      const address1 = await ethers.provider.getSigner(1).getAddress();
      const address2 = await ethers.provider.getSigner(2).getAddress();
      const balanceBeforeTransfer = await contractAsHolder.balanceOf(address1);
      const balanceBeforeTransferReceiver = await contractAsHolder.balanceOf(
        address2
      );
      const tx = await contractAsHolder.transfer(address2, 1000000000);
      await tx.wait(1);
      const balanceAfterTransfer = await contractAsHolder.balanceOf(address1);
      const balanceAfterTransferReceiver = await contractAsHolder.balanceOf(
        address2
      );
      expect(balanceBeforeTransfer).to.be.eq(
        balanceAfterTransfer.add(1000000000)
      );
      expect(balanceAfterTransferReceiver).to.be.eq(
        balanceBeforeTransferReceiver.add(1000000000)
      );
    });

    it("can't transfer token when paused", async () => {
      const tx = await contract.pause();
      await tx.wait(1);
      const holder = ethers.provider.getSigner(2);
      const address = await ethers.provider.getSigner(1).getAddress();
      const contractAsHolder = contract.connect(holder);
      await expect(
        contractAsHolder.transfer(address, 1000000000)
      ).to.be.revertedWith("ERC20Pausable: token transfer while paused");
    });
  });
});
