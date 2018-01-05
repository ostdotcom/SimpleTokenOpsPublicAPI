"use strict";

/* Bonuses contract interactions
 *
 * * Author: Puneet
 * * Date: 28/11/2017
 * * Reviewed by: 
 */

const web3RpcProvider = require('../web3/rpc_provider')
    , helper = require('./helper')
    , coreAddresses = require('../../config/core_addresses')
    , contractName = 'bonuses'
    , currContractAddress = coreAddresses.getAddressForContract(contractName)
    , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
    , getAddressesABI = currContract.methods.getAddresses().encodeABI()
    , getAddressesSizeABI = currContract.methods.getAddressesSize().encodeABI()
    , getRemainingTotalBonusesABI = currContract.methods.remainingTotalBonuses().encodeABI()
    , getStatusABI = currContract.methods.status().encodeABI()
    , getStartIndexABI = currContract.methods.totalProcessed().encodeABI()
    , fs = require('fs');

const _private = {

  processGetAddressesResponse: async function (addressesArray) {

    var addressesArray = await bonusesContractInteract.getAddresses();

    var bonusesData = [];

    for (var i = 0; i < addressesArray.length; i++) {

      var address = addressesArray[i];

      var getBonusAbi = currContract.methods.processables(address).encodeABI();

      var bonusRsp = await helper.call(getBonusAbi, currContractAddress);

      var decodedbonusRsp = await helper.toProcessableAllocation(bonusRsp)

      bonusesData.push([address, decodedbonusRsp.amount])

    }

    return Promise.resolve(bonusesData);

  },

  writeToCsv: async function (bonusesData, fileName) {
    if (!fileName) {
      fileName = "bonusesData.csv";
    }
    var stream = fs.createWriteStream(fileName);
    stream.once('open', function (fd) {
      bonusesData.forEach(function (granteeData) {
        stream.write(granteeData[0] + "," + granteeData[1] + "\n");
      });
      stream.end();
    });
  }

};

const bonusesContractInteract = {

  writeBonusesDataToCsv: async function (fileName) {

    console.log('initiating fetching data from contract at' + currContractAddress);

    var bonusesData = await _private.processGetAddressesResponse();

    console.log('Writing to Csv total count:' + bonusesData.length);

    await _private.writeToCsv(bonusesData, fileName);

    return Promise.resolve(bonusesData.length);

  },
  
  getStartIndexForProcessing: async function () {

    var response = await helper.call(getStartIndexABI, currContractAddress);

    var startIndex = await helper.toNumber(response);

    return Promise.resolve(startIndex);

  },

  getAddressesSize: async function () {

    var response = await helper.call(getAddressesSizeABI, currContractAddress);

    var size = await helper.toNumber(response);

    return Promise.resolve(size);

  },

  getAddresses: async function () {

    var response = await helper.call(getAddressesABI, currContractAddress);

    var addressesArray = await helper.toAddressArray(response)

    return Promise.resolve(addressesArray);

  },

  // In Weis, it returns pending bonuses to be processed
  getRemainingTotalBonuses: async function () {

    var response = await helper.call(getRemainingTotalBonusesABI, currContractAddress);

    var remainingTotalBonuses = await helper.toBigNumber(response);

    return Promise.resolve(remainingTotalBonuses.toString(10));

  },

  getStatus: async function () {

    var response = await helper.call(getStatusABI, currContractAddress);

    var status = await helper.toNumber(response);

    return Promise.resolve(status);

  },

  getProcessableStatus: async function (address) {

    var abi = currContract.methods.processables(address).encodeABI()
        , response = await helper.call(abi, currContractAddress);

    var processableStatus = await helper.toBonusAllocation(response);

    return Promise.resolve(processableStatus);

  },

};

module.exports = bonusesContractInteract;