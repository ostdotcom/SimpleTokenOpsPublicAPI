"use strict";
/*
 * Address specific routes
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response')
  , web3RpcProvider = require('../lib/web3/rpc_provider')
  , web3Interact = require('../lib/web3/interact');

/* Get nonce for a address */
router.get('/get-nonce', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , address = decodedParams.address;

    // handle final response
    const handlePublicOpsSuccess = function (nonce) {
      console.log('--- Nonce received successfully.');
      return responseHelper.successWithData({nonce: nonce}).renderResponse(res);
    };

    return web3RpcProvider.eth.getTransactionCount(address).then(handlePublicOpsSuccess);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_a_1', 'Something went wrong').renderResponse(res)
  });
});

/* Get nonce for a address */
router.get('/get-balance', function (req, res, next) {
  const performer = async function() {
    const decodedParams = req.decodedParams
      , ethereum_address = decodedParams.ethereum_address
      , balanceResult = await web3Interact.getBalance(ethereum_address);

    return balanceResult.renderResponse(res);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_a_2', 'Something went wrong').renderResponse(res)
  });
});

module.exports = router;
