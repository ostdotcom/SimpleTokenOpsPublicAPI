"use strict";
/*
 * Helper methods for contract interact
 *
 * * Author: Kedar
 * * Date: 13/11/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('../web3/rpc_provider');

const helper = {
  call: function (encodeABI, currContractAddr) {
    return web3RpcProvider.eth.call({
      to: currContractAddr,
      data: encodeABI
    });
  },

  toNumber: function (result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.utils.hexToNumber(result));
    });
  },

  decodeUint256: function (result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameter('uint256', result));
    });
  }
};

module.exports = helper;