// dotenv, Web3, ETx, Common, customChainParams, common, req, TRXHash, web3, nftContractABI, contractABI, contractABI, contractAddress, contract, Web3Storage, getFilesFromPath, token, client
const dotenv = require("dotenv");

dotenv.config();

const Web3 = require('web3');

const ETx = require("ethereumjs-tx").Transaction;

const Common = require('ethereumjs-common')

const customChainParams = { name: 'matic-mumbai', chainId: 80001, networkId: 80001 , chain: "matic-mumbai", hardfork: "petersburg"}

const common = Common.default.forCustomChain('goerli', customChainParams, 'petersburg');

const req = require('express/lib/request');

const TRXHash = require("../models/transactions");

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));

const nftContractABI = require("../contractdetails/Brahma.json");

const contractABI = nftContractABI.abi;

const contractAddress = nftContractABI.networks[3].address;

const contract = new web3.eth.Contract(contractABI, contractAddress);

const { Web3Storage, getFilesFromPath } = require('web3.storage');

const token = process.env.IPFS;

const client = new Web3Storage({ token })

 const Roles = {
    0: "USER",
    1: "ADMIN",
    2: "AUTHOR",
    3: "EDITOR",
    4: "REVIEWER",
    5: "PUBLISHER"
}

module.exports = {Roles, dotenv, Web3, ETx, Common, customChainParams, common, req, TRXHash, web3, nftContractABI, contractABI, contractABI, contractAddress, contract, Web3Storage, getFilesFromPath, token, client}
    