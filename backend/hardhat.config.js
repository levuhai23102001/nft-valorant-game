require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-diamond-abi");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-etherscan");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

function filterDuplicateFunctions(
  abiElement,
  index,
  fullAbiL,
  fullyQualifiedName
) {
  if (["function", "event"].includes(abiElement.type)) {
    const funcSignature = genSignature(
      abiElement.name,
      abiElement.inputs,
      abiElement.type
    );
    if (elementSeenSet.has(funcSignature)) {
      return false;
    }
    elementSeenSet.add(funcSignature);
  } else if (abiElement.type === "event") {
  }

  return true;
}

const elementSeenSet = new Set();
// filter out duplicate function signatures
function genSignature(name, inputs, type) {
  return `${type} ${name}(${inputs.reduce((previous, key) => {
    const comma = previous.length ? "," : "";
    return previous + comma + key.internalType;
  }, "")})`;
}

module.exports = {
  solidity: "0.8.1",

  diamondAbi: {
    // (required) The name of your Diamond ABI
    name: "awesomeGame",
    include: ["Facet"],
    strict: true,
    filter: filterDuplicateFunctions,
  },

  abiExporter: {
    path: "./data/abi",
    runOnCompile: true,

    flat: true,

    only: [":Diamond$", ":DiamondInit$"],
  },

  networks: {
    // mumbai: {
    //   url: process.env.STAGING_ALCHEMY_KEY,
    //   accounts: [process.env.PRIVATE_KEY],
    // },

    localhost: {
      chainId: 31337,
    },
  },

  etherscan: {
    // Obtain one at https://etherscan.io/
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
  },
};
