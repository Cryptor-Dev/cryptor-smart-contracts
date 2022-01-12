import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: [
        process.env.ROPSTEN_PRIVATE_KEY_1 !== undefined
          ? process.env.ROPSTEN_PRIVATE_KEY_1
          : "",
        process.env.ROPSTEN_PRIVATE_KEY_2 !== undefined
          ? process.env.ROPSTEN_PRIVATE_KEY_2
          : "",
        process.env.ROPSTEN_PRIVATE_KEY_3 !== undefined
          ? process.env.ROPSTEN_PRIVATE_KEY_3
          : "",
      ],
    },
    mainnet: {
      url: process.env.ETHEREUM_MAINNET || "",
      accounts:
        process.env.ETHEREUM_PRIVATE_KEY_1 !== undefined
          ? [process.env.ETHEREUM_PRIVATE_KEY_1]
          : [],
    },
  },
  mocha: {
    timeout: 5000000000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    coinmarketcap: process.env.COINMARKETCAPAPI,
    currency: "EUR",
  },
};

export default config;
