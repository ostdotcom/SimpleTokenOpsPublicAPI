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
  , tokenSaleContractInteract = require('../lib/contract_interact/token_sale')
  , simpleTokenContractInteract = require('../lib/contract_interact/simple_token')
  , coreAddresses = require('../config/core_addresses');

/* Get whitelist status for a address */
router.get('/whitelist-status', function (req, res, next) {
  const performer = async function() {
    const decodedParams = req.decodedParams
      , contractAddress = decodedParams.contract_address
      , ethereumAddress = decodedParams.ethereum_address
      , whitelistPhase = await tokenSaleContractInteract.getWhitelistPhase(contractAddress, ethereumAddress);

    const apiResponseData = {
      phase: whitelistPhase
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_ts_1', 'Something went wrong').renderResponse(res)
  });

});

/* Get balance of a address */
router.get('/get-balance', function (req, res, next) {
  const performer = async function() {
    const decodedParams = req.decodedParams
      , ethereumAddress = decodedParams.ethereum_address
      , balance = await simpleTokenContractInteract.getBalance(ethereumAddress);

    const apiResponseData = {
      balance: balance
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_ts_2', 'Something went wrong').renderResponse(res)
  });

});


module.exports = router;
