const Wallet = artifacts.require("Wallet");

const truffleAssert = require("../node_modules/truffle-assertions");

contract("Wallet", async accounts => {
    if("should instatiate Wallet contract", async () => {
        let wallet =  Wallet.deployed();
    });
});

