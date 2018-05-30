"use strict";
/*
 * Web3 send transaction
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const rootPre = "../../"
  , web3RpcProvider = require('./rpc_provider')
  , responseHelper = require('../formatter/response')
  , globalConstantST = require(rootPre + 'lib/global_constant/send_transaction')
;

const transactionErrorText = {

  insufficientFunds      : 'insufficient funds',
  knownTransaction       : 'known transaction',
  nonceLow               : 'nonce too low',
  transactionUnderPriced : 'replacement transaction underpriced'
};


const web3SendTransaction = {

  perform: function (sigedTx) {

    return new Promise(function (onResolve, onReject) {

      // end the response once you get the transaction hash.
      const onTxHash = function (transactionHash) {
        console.log('--- Transaction hash received successfully.');
        onResolve(responseHelper.successWithData({transaction_hash: transactionHash}));
      };

      const onTxHashError = function (err) {
        console.error('### Error while getting transaction hash.');

        var errorCode = '';

        if (err.message.toLowerCase().indexOf(transactionErrorText.insufficientFunds) > -1){
          errorCode = globalConstantST.low_balance;
        }else if (err.message.toLowerCase().indexOf(transactionErrorText.knownTransaction) > -1){
          errorCode = globalConstantST.known_transaction;
        }else if(err.message.toLowerCase().indexOf(transactionErrorText.nonceLow) > -1){
          errorCode = globalConstantST.wrong_nonce;
        }else if(err.message.toLowerCase().indexOf(transactionErrorText.transactionUnderPriced) > -1){
          errorCode = globalConstantST.transaction_underpriced;
        }

        onResolve(responseHelper.error(errorCode, 'publicGeth('+ err.message + ')'));
        //onResolve(responseHelper.error('publicGeth('+ err.message + ')', 'transaction hash not obtained.'));
      };

      web3RpcProvider.eth.sendSignedTransaction(sigedTx).once('transactionHash', onTxHash)
        .catch(onTxHashError);

    });
  }

};

module.exports = web3SendTransaction;