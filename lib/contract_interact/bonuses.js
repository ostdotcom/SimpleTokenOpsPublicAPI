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
    , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
    , getProcessablesSizeABI = currContract.methods.getProcessablesSize().encodeABI()
    , getRemainingTotalBonusesABI = currContract.methods.remainingTotalBonuses().encodeABI()
    , getStatusABI = currContract.methods.status().encodeABI()
    , getStartIndexABI = currContract.methods.totalProcessed().encodeABI()
    , fs = require('fs');

/**
 * @constructor
 */
const bonusContractInteract = module.exports = function (contractAddress) {
  this.currContractAddress = contractAddress;
}

bonusContractInteract.prototype = {

  writeBonusesDataToCsv: async function (fileName) {

    const oThis = this;

    console.log('initiating fetching data from contract at' + oThis.currContractAddress);

    var bonusesData = await oThis._getDataFromContract();

    console.log('Writing to Csv total count:' + bonusesData.length);

    await oThis._writeToCsv(bonusesData, fileName);

    return Promise.resolve(bonusesData.length);

  },

  getStartIndexForProcessing: async function () {

    const oThis = this;

    var response = await helper.call(getStartIndexABI, oThis.currContractAddress);

    var startIndex = await helper.toNumber(response);

    return Promise.resolve(startIndex);

  },

  getProcessablesSize: async function () {

    const oThis = this;

    var response = await helper.call(getProcessablesSizeABI, oThis.currContractAddress);

    var size = await helper.toNumber(response);

    return Promise.resolve(size);

  },

  // In Weis, it returns pending bonuses to be processed
  getRemainingTotalBonuses: async function () {

    const oThis = this;

    var response = await helper.call(getRemainingTotalBonusesABI, oThis.currContractAddress);

    var remainingTotalBonuses = await helper.toBigNumber(response);

    return Promise.resolve(remainingTotalBonuses.toString(10));

  },

  getStatus: async function () {

    const oThis = this;

    var response = await helper.call(getStatusABI, oThis.currContractAddress);

    var status = await helper.toNumber(response);

    return Promise.resolve(status);

  },

  getProcessableStatus: async function (index) {

    const oThis = this;

    var abi = currContract.methods.processables(index).encodeABI()
        , response = await helper.call(abi, oThis.currContractAddress);

    var processableStatus = await helper.toBonusAllocation(response);

    return Promise.resolve(processableStatus);

  },

  _getDataFromContract: async function () {

    const oThis = this,
        size = await oThis.getProcessablesSize();

    var data = [];

    for ( var i = 0; i < size; i ++) {

      var rowData = await oThis.getProcessableStatus(i);
      data.push([rowData.addr, rowData.amount])
    }

    return Promise.resolve(data);

  },

  _writeToCsv: async function (bonusesData, fileName) {
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

}