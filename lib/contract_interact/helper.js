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

  toBigNumber: function (result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.utils.toBN(result));
    });
  },

  decodeUint256: function (result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameter('uint256', result));
    });
  },

  toAddressArray: function (result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameter('address[]', result));
    });
  },

  toGrantableAllocation: function(result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameters(
      [
        {
          type: 'uint256',
          name: 'amount'
        },
        {
          type: 'bool',
          name: 'revokable'
        }
      ], result));
    });
  },

  toProcessableAllocation: function(result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameters(
          [
            {
              type: 'uint256',
              name: 'amount'
            }
          ], result));
    });
  },

  toBonusAllocation: function(result) {
    return new Promise(function(onResolve, onReject){
      onResolve(web3RpcProvider.eth.abi.decodeParameters(
          [
            {
              type: 'address',
              name: 'addr'
            },
            {
              type: 'uint256',
              name: 'amount'
            },
            {
              type: 'bool',
              name: 'processed'
            }
          ], result));
    });
  },


};

module.exports = helper;