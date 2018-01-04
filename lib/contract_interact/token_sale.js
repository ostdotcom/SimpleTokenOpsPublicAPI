"use strict";
/*
 * Token Sale contract interactions
 *
 * * Author: Kedar
 * * Date: 13/11/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('../web3/rpc_provider')
  , helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , genericWhitelistContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('genericWhitelist'));

const tokenSaleContractInteract = {

  getWhitelistPhase: function (contractAddress, addr) {
    const encodeABI = genericWhitelistContract.methods.whitelist(addr).encodeABI();

    return helper.call(encodeABI, contractAddress).then(helper.toNumber);
  }

};

module.exports = tokenSaleContractInteract;