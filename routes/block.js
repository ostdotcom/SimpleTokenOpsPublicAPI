"use strict";
/*
 * Get block related details
 *
 * * Author: Kedar
 * * Date: 08/11/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response')
  , web3Interact = require('../lib/web3/interact')
  , coreAddresses = require('../config/core_addresses');

/* Get transaction block info for a transaction hash */
router.get('/get-transactions', function (req, res, next) {
  const performer = async function() {
    const decodedParams = req.decodedParams
      , blockNumber = decodedParams.block_number
      , blockResult = await web3Interact.getBlock(blockNumber);

    if(blockResult.isFailure()) {
      return blockResult.renderResponse(res);
    }

    // Get highest block number
    const hightestBlockResult = await web3Interact.highestBlock();
    if(hightestBlockResult.isFailure()) {
      return hightestBlockResult.renderResponse(res);
    }
    const hightestBlock = hightestBlockResult.data.block_number;

    var transactions = blockResult.data.transactions
      , batchSize = 25
      , promiseArray = []
      , relevantTransactions = [];

    // looping over all the transactions and decoding the relevant ones.
    for(var i = 0; i < transactions.length; i++) {
      promiseArray.push(web3Interact.getReceipt(transactions[i]));

      if((((i + 1) % batchSize) == 0) || ((i+1) == transactions.length)) {
        var txReceipts = await Promise.all(promiseArray);

        for(var j = 0; j < txReceipts.length; j++) {
          // get transaction receipt
          var txReceiptResult = txReceipts[j];
          if(txReceiptResult.isFailure()) {
            return txReceiptResult.renderResponse(res);
          }
          // get receipt data
          var receiptData = txReceiptResult.data;
          if(!coreAddresses.getContractNameFor(receiptData.to_address)){
            continue;
          }

          relevantTransactions.push(receiptData);
        }

        promiseArray = [];
      }
    }

    const apiResponse = {
      meta: {
        hightest_block: hightestBlock,
        current_block: {
          block_number: blockResult.data.block_number,
          block_hash: blockResult.data.block_hash,
          timestamp: blockResult.data.timestamp
        }
      },
      transactions: relevantTransactions
    };

    return responseHelper.successWithData(apiResponse).renderResponse(res);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_b_1', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
