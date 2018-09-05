const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response')
  , web3SendTransaction = require('../lib/web3/send_transaction')
  , web3Interact = require('../lib/web3/interact');

/* Get transaction block info for a transaction hash */
router.get('/get-info', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , transactionHash = decodedParams.transaction_hash
      , contractName = decodedParams.contract_type
    ;

    const renderResult = function(result) {
      return result.renderResponse(res);
    };

    const processReceipt = function(txReceipt){
      //txReceipt is a responseHelper object and data can be {}
      const loTxReceipt = txReceipt.data;

      if (loTxReceipt.hasOwnProperty('status')){
        const txStatus = loTxReceipt.status;
        if (txStatus === true){
          loTxReceipt.status = 'mined';
        }else{
          loTxReceipt.status = 'failed';
        }
        //txReceipt is a responseHelper object
        return Promise.resolve(txReceipt);
      }else{
        return web3Interact.getTransaction(transactionHash)
          .then(function(tx){
            if (tx){
              loTxReceipt.status = 'pending';
            }else{
              loTxReceipt.status = 'invalid';
            }

            return Promise.resolve(responseHelper.successWithData(loTxReceipt));
          })
          .catch(function(){
            loTxReceipt.status = 'pending';
            return Promise.resolve(responseHelper.successWithData(loTxReceipt));
          })
      }
    };

    return web3Interact.getReceipt(transactionHash, contractName)
      .then(processReceipt)
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
      console.log("render result : ", result)
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
