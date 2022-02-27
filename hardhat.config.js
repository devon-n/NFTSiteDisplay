require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const apiKeys = require("./secret.json")

const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "YOURPROJECTIDHERE"


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    // ropsten: {
    //   url: `https://ropsten.infura.io/v3/${projectId}`,
    //   accounts: [privateKey]
    // },
    // mainnet: {
    //   url: `https://mainnet.infura.io/v3/${projectId}`,
    //   accounts: [privateKey],
    // }
  },
  etherscan: {
    apiKey: {
      mainnet: apiKeys["mainnet"],
      bsc: apiKeys["bsc"],
      polygon: apiKeys["polygon"],
    }
  },
  solidity: "0.8.4",
};
