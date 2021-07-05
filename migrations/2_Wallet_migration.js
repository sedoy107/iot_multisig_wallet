const Wallet = artifacts.require("Wallet");

const count = 3;

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Wallet, count, accounts.slice(0,count));
};
