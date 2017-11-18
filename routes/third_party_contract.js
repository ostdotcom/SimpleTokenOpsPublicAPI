"use strict";
/*
 * Get block related details of non simple token contracts.
 *
 * * Author: Alpesh, Kushal, Pankaj, Aniket
 * * Date: 17/11/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response')
  , thirdPartyContractInteract = require('../lib/contract_interact/third_party');


/* Get balance of a address */
router.get('/get-balance', function (req, res, next) {
  const performer = async function() {
    const decodedParams = req.decodedParams
      , ethereumAddress = decodedParams.ethereum_address
      , contractAddress = decodedParams.contract_address
      , balance = await thirdPartyContractInteract.getBalance(ethereumAddress, contractAddress);

    const apiResponseData = {
      balance: balance
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_tpc_2', 'Something went wrong').renderResponse(res)
  });

});


module.exports = router;
