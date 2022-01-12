import { ethers } from "hardhat";

async function main() {
  const cryptorFactory = await ethers.getContractFactory("Cryptor");
  // 420,000,000 tokens will be capped
  const cryptor = await cryptorFactory.deploy(
    "420000000000000000",
    "0xD377CF2BC2Feed9ab2da4D495856Fd0957FFc108"
  );

  await cryptor.deployed();

  console.log("Token deployed to:", cryptor.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
