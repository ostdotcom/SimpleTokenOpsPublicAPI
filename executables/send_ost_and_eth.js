"use strict";

const rootPrefix = '..'
  , Web3 = require('web3')
  , fs = require('fs')
  , parseCsv = require('csv-parse')
  , readline = require('readline')
  , Bignumber = require('bignumber.js')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , contractName = 'simpleToken'
  , simpleTokenAddress = coreAddresses.getAddressForContract(contractName)
  , simpleTokenContractInteract = require(rootPrefix + '/lib/contract_interact/simple_token')
  , senderAddr = ''
  , senderPassphrase = ''
  , csvFilePath = './executables/ether_cards.csv'
  , csvStartIndex = 0
  , web3RpcProvider = new Web3(coreConstants.ST_GETH_RPC_PROVIDER)
  , simpleTokenContractObj = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('simpleToken'))
  , gasPrice = '0x2540BE400' // tenGw
  , gasLimit = '0x15F90' // 90000
  // , ethTransferValueInWei = '600000000000000'
  , ostTransferValuenWei = '100000000000000000000'
  , txHashes = []
;

const SendOSTAndEth = {

  perform: async function() {

    const oThis = this;

    const ethAddresses = await oThis.readFromCsv();

    await oThis.validateEthAddresses(ethAddresses);

    var prompts = readline.createInterface(process.stdin, process.stdout);

    await new Promise(

      function (onResolve, onReject) {

        console.log("ethAddresses.length", ethAddresses.length);
        console.log('ethAddresses', ethAddresses);

        console.log('simpleTokenAddress', simpleTokenAddress);
        console.log('senderAddr', senderAddr);
        console.log('csvFilePath', csvFilePath);
        console.log('csvStartIndex', csvStartIndex);
        console.log('gasPrice', gasPrice);
        // console.log('ethTransferValueInWei', ethTransferValueInWei);
        console.log('ostTransferValuenWei', ostTransferValuenWei);

        prompts.question("Do you want to really want to transfer to above ? [Y/N]",
          function (intent) {
            if (intent === 'Y') {
              console.log("Initiating transfer: ");
              prompts.close();
              onResolve();
            } else {
              console.error('Exiting script.');
              process.exit(1);
            }
          }
        );
      }

    );

    for(let i=0; i<ethAddresses.length; i++) {

      // wait for 1 sec
      await oThis.wait(1000);

      await oThis.sendToAddress(ethAddresses[i]);

    }

    console.log('DONE SUBMITTING TRANSACTIONS WAITING FOR THEM TO BE MINED', txHashes);

    await oThis.waitForTxsToBeMined();

    console.log('verifying balances for all addresses');

    await oThis.verifyBalances(ethAddresses);

  },


  readFromCsv: async function() {

    return new Promise(function (onResolve, onReject) {

      const ethereum_dict = [];

      let index = 0;

      fs.createReadStream(csvFilePath)
        .pipe(parseCsv({delimiter: ','}))
        .on('data', function (csvrow) {
          let ethAddress = csvrow[0].replace(/\s+/g,'').toLowerCase();
          if (index < csvStartIndex) {
            console.log('ignoring ', index, ethAddress);
          } else {
            console.log('accepting', index, ethAddress);
            ethereum_dict.push(ethAddress)
          }
          index += 1
        })
        .on('end', function () {
          onResolve(ethereum_dict);
        })
        .on('error', function (e) {
          console.error("Error: " + e + " in CSV parsing ");
          process.exit(1);
        });

    });

  },

  validateEthAddresses: async function(ethAddresses) {

    let invalidAddresses = [];

    for(let i=0; i<ethAddresses.length; i++) {

      if (!web3RpcProvider.utils.isAddress(ethAddresses[i])) {
        invalidAddresses.push(ethAddresses[i]);
        console.error("Address " + ethAddresses[i] + " is not a valid ethereum address");
      }

    }

    if (invalidAddresses.length > 0) {
      console.error("some Addresses invalid", invalidAddresses);
      return Promise.reject();
    }

  },

  sendToAddress: async function(ethAddress) {

    console.log("starting to fund ", ethAddress);

    // await web3RpcProvider.eth.personal.unlockAccount(senderAddr, senderPassphrase);
    //
    // console.log('funder unlocked!');
    //
    // console.log("sending ETH to ", ethAddress);

    // let ethTransferTxHash = await new Promise(
    //
    //   function (onResolve, onReject) {
    //
    //     let ethSendParams = {
    //       from: senderAddr,
    //       to: ethAddress,
    //       value: ethTransferValueInWei,
    //       gasPrice: gasPrice,
    //       gas: gasLimit
    //     };
    //
    //     web3RpcProvider.eth.sendTransaction(ethSendParams)
    //       .on('transactionHash', function (transactionHash) {
    //         console.log(`hash for Eth Transfer to ${ethAddress} --> ${transactionHash}`);
    //         onResolve(transactionHash);
    //       });
    //
    //   }
    //
    // );

    await web3RpcProvider.eth.personal.unlockAccount(senderAddr, senderPassphrase);
    console.log('funder unlocked!');
    console.log("sending OST to ", ethAddress);

    let ostTransferTxHash = await new Promise(

      function (onResolve, onReject) {

        let encodedABI = simpleTokenContractObj.methods.transfer(ethAddress, ostTransferValuenWei).encodeABI();

        let ostTransferParams = {
          from: senderAddr,
          to: simpleTokenAddress,
          data: encodedABI,
          gasPrice: gasPrice,
          gas: gasLimit
        };

        web3RpcProvider.eth.sendTransaction(ostTransferParams)
          .on('transactionHash', function (transactionHash) {
            console.log(`hash for OST Transfer to ${ethAddress} --> ${transactionHash}`);
            onResolve(transactionHash);
          });

      }

    );

    txHashes.push({
      address: ethAddress,
      // ethTransferTxHash: ethTransferTxHash,
      ostTransferTxHash: ostTransferTxHash
    })

  },

  waitForTxsToBeMined: async function() {

    const oThis = this;

    for(let i=0; i<txHashes.length; i++) {

      let data = txHashes[i];

      console.log('waiting for mining of txs to: ', data.address);

      // await oThis.fetchTxReceipt(data.ethTransferTxHash);

      await oThis.fetchTxReceipt(data.ostTransferTxHash);

    }

  },

  fetchTxReceipt: async function(txHash) {

    await new Promise(

      function (onResolve, onReject) {

        let txSetInterval = null;

        let handleGetTxReceipt = function (receipt) {

          if (!receipt) {
            console.log('Waiting for ' + txHash + ' to be mined');
          } else {
            // console.log('receipt', txHash, receipt);
            console.log('txHash ' + txHash + ' mined');
            clearInterval(txSetInterval);
            let status = (receipt || {})['status'];
            if (status === true || status === '0x1') {
              onResolve();
            } else {
              onReject(receipt);
            }
          }
        };

        txSetInterval = setInterval(
          function(){
            web3RpcProvider.eth.getTransactionReceipt(txHash).then(handleGetTxReceipt);
          },
          1000
        );

      }

    );

  },

  verifyBalances:  async function(ethAddresses) {

    // const requiredEthBalance = new Bignumber(ethTransferValueInWei);
    const requiredOstBalance = new Bignumber(ostTransferValuenWei);

    for(let i=0; i<ethAddresses.length; i++) {

      let ethAddress = ethAddresses[i];

      // let ethBalance = await web3RpcProvider.eth.getBalance(ethAddress);
      // let ethBalanceBn = new Bignumber(ethBalance);

      // if (!ethBalanceBn.eq(requiredEthBalance)) {
      //   console.error(`ETH balance mismatch for ${ethAddress} found: ${ethBalance}`);
      // } else {
      //   console.log('ETH balance match for ', ethAddress);
      // }

      let ostBalance = await simpleTokenContractInteract.getBalance(ethAddress);
      let ostBalanceBn = new Bignumber(ostBalance);

      if (!ostBalanceBn.eq(requiredOstBalance)) {
        console.error(`OST balance mismatch for ${ethAddress} found: ${ostBalance}`);
      } else {
        console.log('OST balance match for ', ethAddress);
      }

    }

  },

  wait: function(timeInMs){
    return new Promise(function(onResolve, onReject){
      setTimeout(function () {
        console.log('waiting completed');
        onResolve();
      }, timeInMs);
    });
  }

};

SendOSTAndEth.perform().then(console.log);