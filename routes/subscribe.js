"use strict";
/*
 *
 *
 * * Author: Aniket
 * * Date: 30/07/2018
 * * Reviewed by:
 */

const express = require('express')
  , router = express.Router()
;


const rootPrefix = '..'
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , updateWhitelistKlass = require(rootPrefix + '/events/token_sale/whitelist_updated')
;

router.post('/whitelist-updated', function (req, res, next) {
  const performer = async function() {
    const decodedParams = req.decodedParams;

    updateWhitelistKlass.updateWhitelist(decodedParams.contract_addresses);

    return responseHelper.successWithData({}).renderResponse(res);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_s_1', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;