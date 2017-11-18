const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response')
  , web3SendTransaction = require('../lib/web3/send_transaction')
  , web3Interact = require('../lib/web3/interact');

/* Get transaction block info for a transaction hash */
router.get('/get-info', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , transactionHash = decodedParams.transaction_hash;

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return web3Interact.getReceipt(transactionHash)
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_1', 'Something went wrong').renderResponse(res)
  });
});

/* Send signed transaction */
router.post('/send', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , signedTx = decodedParams.signed_tx;

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    return web3SendTransaction.perform(signedTx)
      .then(renderResult);
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_t_2', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
