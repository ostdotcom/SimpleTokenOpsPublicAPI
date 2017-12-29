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
  //, currContractAddr = coreAddresses.getAddressForContract('tokenSale')
  , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('tokenSale'));

const tokenSaleContractInteract = {

  getWhitelistPhase: function (contractAddress, addr) {
    const encodeABI = currContract.methods.whitelist(addr).encodeABI();

    return helper.call(encodeABI, contractAddress).then(helper.toNumber);
  }

};

module.exports = tokenSaleContractInteract;