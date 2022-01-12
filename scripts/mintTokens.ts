// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import CryptorAbi from "../artifacts/contracts/CryptorToken/Cryptor.sol/Cryptor.json";
// eslint-disable-next-line node/no-missing-import
import { Cryptor } from "../typechain";

async function main() {
  const cryptorToken = new ethers.Contract(
    // contract address of deployed cryptor token
    "",
    CryptorAbi.abi,
    // address responsible for minting
    await ethers.provider.getSigner(0)
  ) as Cryptor;

  // address towards where tokens will be minted and amount of token to be minted
  await cryptorToken.mint("", "");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
