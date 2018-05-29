//
// Utils.js - Utility library for deploying contracts
//
// Copyright (c) 2017 Enuma Technologies
//
const fs   = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const Path = require('path');


function loadAbiByName(name) {
   const filePath = Path.join("./abi/" + name + ".json")

   return loadAbiByPath(filePath)
}


function loadByteCodeByName(name) {
   const filePath = Path.join("./bin/" + name + ".bin")

   return loadByteCodeByPath(filePath)
}


function loadAbiByPath(abiFilePath) {
   return JSON.parse(fs.readFileSync(abiFilePath))
}


function loadByteCodeByPath(binFilePath) {
   return fs.readFileSync(binFilePath)
}


async function deployContractFromSource(web3, name, deployKey, abi, bytecode, args) {

   const oneGW = '0x3B9ACA00' // taken from http://ethgasstation.info/ ---- 1 gwei
     , fiveGW = '0x12A05F200'
    , twentyOneGw = '0x4E3B29200' // 21 Gwei
    , thirtyOneGw = '0x737BE7600' // 31 Gwei
    , fortyOneGw = '0x98BCA5A00' // 41 Gwei
    , fiftyOneGw = '0xBDFD63E00' // 51 Gwei
    , sixtyOneGw = '0xE33E22200' // 61 Gwei
   ; // 5 GWei

   var gasPrice = sixtyOneGw;

   var options = {
      from : deployKey,
      gas  : 4700000,
      data : "0x" + bytecode,
      gasPrice: gasPrice // taken from http://ethgasstation.info/ ---- 1 gwei
   }

   if (args) {
      options.arguments = args
   }

   const contract = new web3.eth.Contract(abi, null, options)

   var tx = contract.deploy(options)

   var txid = null
   var receipt = null

   console.log("Deploying contract " + name)

   const instance = await tx.send()
      .on('receipt', (value) => {
         receipt = value
      })
      .on('transactionHash', function(value){
         console.log("TxID     : " + value)
         txid = value
      })
      .on('error', function(error){
         return Promise.reject(error)
      });

   const code = await web3.eth.getCode(instance.options.address)

   if (code.length <= 2) {
      return Promise.reject("Contract deployment failed. Empty code.")
   }

   // Print summary
   console.log("Address  : " + instance.options.address)
   console.log("Gas used : " + receipt.gasUsed)

   return Promise.resolve({
      receipt  : receipt,
      instance : instance
   })
}


async function run() {

  const geth_provider = process.env.ST_DEPLOYER_GETH_PROVIDER;
  console.log('Deploying contracts on: ' + geth_provider);

  const web3 = new Web3(new Web3.providers.HttpProvider(geth_provider));

  // Public Machine Keys
  // DEPLOYER
  const deployKey = process.env.ST_DEPLOYER_ADDR;
  console.log('Deployer Address: ' + deployKey);

  const deployKeyPassphrase = process.env.ST_DEPLOYER_ADDR_PASSPHRASE;

  await web3.eth.personal.unlockAccount(deployKey, deployKeyPassphrase);

  // Deploy GenericWhitelist contract
  const name = "GenericWhitelist";
  const abi      = loadAbiByName(name);
  const bytecode = loadByteCodeByName(name);

  const tokenResult = await deployContractFromSource(web3, name, deployKey, abi, bytecode);
  const tokenSaleAddress   = tokenResult.receipt.contractAddress;
  console.log("GenericWhitelist Contract Deployed:", tokenSaleAddress);
}


run();


