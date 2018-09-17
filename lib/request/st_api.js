"use strict";
/*
 * Make API calls to ST API
 *
 * * Author: Kedar
 * * Date: 25/10/2017
 * * Reviewed by: Sunil
 */

const jwtAuth = require('../jwt/jwt_auth')
  , httpWrapper = require('./http_wrapper')
  , coreConstants = require('../../config/core_constants');

const _private = {
  sendGetRequest: function(path, requestData) {

    console.log('Calling ST API GET: ' + path);

    return httpWrapper.get(
      coreConstants.ST_API_BASE_URL,
      path,
      {token: jwtAuth.issueToken(requestData, 'publicOps')}
    ).catch(function(err){
      console.error('### Error in calling ' + path + '. Inside Catch block.');
      console.error(err);
      console.error(requestData);
    });

  }
}

const stApi = {

  // Get current nonce from Ops Public
  sendWhitelistConfirmation: function(requestData) {
    return _private.sendGetRequest('/callback/whitelist-event', requestData);
  },

  getWhitelistContractAddresses: async function(){
   return Promise.resolve(_private.sendGetRequest('/callback/get-whitelist-contract-addresses',{}));
  }

};

module.exports = stApi;
