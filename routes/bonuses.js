"use strict";
/*
 * Routes Related To Bonuses Contract Data
 *
 * * Author: Puneet
 * * Date: 08/01/2018
 * * Reviewed by:
 */

const express = require('express')
    , router = express.Router()
    , responseHelper = require('../lib/formatter/response')
    , bonusesContractInteract = require('../lib/contract_interact/bonuses')
    , simpleTokenContractInteract = require('../lib/contract_interact/simple_token')
    , coreAddresses = require('../config/core_addresses');

/* Get Start Index For Procssing Data in Bonuses */
router.get('/addresses-size', function (req, res, next) {

  const performer = async function() {

    const size = await bonusesContractInteract.getAddressesSize();

    const apiResponseData = {
      size: size
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);

  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_b_1', 'Something went wrong').renderResponse(res)
  });

});

/* Get Start Index For Procssing Data in Bonuses */
router.get('/start-index-for-processing', function (req, res, next) {

  const performer = async function() {

    const startIndex = await bonusesContractInteract.getStartIndexForProcessing();

    const apiResponseData = {
      startIndex: startIndex
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);

  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_b_2', 'Something went wrong').renderResponse(res)
  });

});

/* Get Remaining Bonuses (which are yet to be processed) */
router.get('/remaining-total-bonuses', function (req, res, next) {

  const performer = async function() {

    const remainingTotalBonuses = await bonusesContractInteract.getRemainingTotalBonuses();

    const apiResponseData = {
      remainingTotalBonuses: remainingTotalBonuses
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);

  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_b_3', 'Something went wrong').renderResponse(res)
  });

});

/* Get Status of Bonuses Contract */
router.get('/get-contract-status', function (req, res, next) {

  const performer = async function() {

    const status = await bonusesContractInteract.getStatus();

    const apiResponseData = {
      status: status
    };

    return responseHelper.successWithData(apiResponseData).renderResponse(res);

  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_b_4', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;