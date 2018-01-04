"use strict";
/*
 * Generic Whitelist contract interactions
 *
 * * Author: Aman
 * * Date: 04/01/2018
 * * Reviewed by: Kedar
 */

const web3RpcProvider = require('../web3/rpc_provider')
  , helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , genericWhitelistContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('genericWhitelist'));

const genericWhitelistContractInteract = {

  getWhitelistPhase: function (contractAddress, addr) {
    const encodeABI = genericWhitelistContract.methods.whitelist(addr).encodeABI();

    return helper.call(encodeABI, contractAddress).then(helper.toNumber);
  }

};

module.exports = genericWhitelistContractInteract;