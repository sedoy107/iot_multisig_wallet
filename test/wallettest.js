'use strict';

const Wallet = artifacts.require("Wallet");

const truffleAssert = require("../node_modules/truffle-assertions");

const Chance = require('../node_modules/chance');
const chance = new Chance();

contract("Wallet", async accounts => {
    it("should correctly encode accounts", async () => {
        let wallet = await Wallet.deployed();
        let owners = (await wallet.getOwners()).map(x => parseInt(x));
        let length = owners.length;
        assert.equal(length, 6, "Wrong owner count");
        for (let i = 0; i < length; i++) {
            assert.equal(owners[i], 1 << i, "Wrong binary encoding");
        }
    });
    describe("deposit", async () => {
        it("owner should be able to depost ether to wallet", async () => {
            let wallet = await Wallet.deployed();
            await wallet.deposit({from: accounts[0], value: web3.utils.toBN(10 ** 19)});
            let balance = await wallet.getBalance();
            assert(balance.eq(web3.utils.toBN(10 ** 19)), "Balance doesn't match");
            
        });
        it("non-owner should be able to depost ether to wallet", async () => {
            let wallet = await Wallet.deployed();
            await wallet.deposit({from: accounts[9], value: 10 ** 19});
            let balance = await wallet.getBalance();
            assert(balance.eq(web3.utils.toBN(2 * (10 ** 19))), "Balance doesn't match");
        });
    });
    describe("createTransfer", async () => {
        it("should not allow non-owner to create transfer", async () => {
            let wallet = await Wallet.deployed();
            await truffleAssert.reverts(
                wallet.createTransfer(accounts[9], web3.utils.toBN(10 ** 18), {from: accounts[9]})
            );
        });
        it("should correctly handle insufficient balance", async () => {
            let wallet = await Wallet.deployed();
            await truffleAssert.reverts(
                wallet.createTransfer(accounts[9], web3.utils.toBN(10 ** 20), {from: accounts[0]})
            );
        });
        it("should correctly create transfer", async () => {
            let wallet = await Wallet.deployed();
            await truffleAssert.passes(
                wallet.createTransfer(accounts[9], web3.utils.toBN(10 ** 19), {from: accounts[0]})
            );
        });
    });
    describe("approveTransfer", async () => {
        it("should not allow non-owner to approve transfer", async () => {
            let wallet = await Wallet.deployed();
            await truffleAssert.reverts(
                wallet.approveTransfer(0, {from: accounts[9]})
            );
        });
        it("should correctly handle transfer approval", async () => {
            let wallet = await Wallet.deployed();
            await truffleAssert.reverts(
                wallet.approveTransfer(0, {from: accounts[1]})
            );
        });
        it("should not allow an account to approve more than once", async () => {
            let wallet = await Wallet.deployed();
            await truffleAssert.reverts(
                wallet.approveTransfer(0, {from: accounts[0]})
            );
        });
        it("should correctly create transfer", async () => {
            let wallet = await Wallet.deployed();
            //const result = await debug(wallet.createTransfer(accounts[9], web3.utils.toBN(10 ** 19), {from: accounts[0]}))
            await truffleAssert.passes(
               wallet.createTransfer(accounts[9], web3.utils.toBN(10 ** 19), {from: accounts[0]})
            );
        });
    });
});

