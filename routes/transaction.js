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

    const processReceipt = function(txReceipt){
      const loTxReceipt = txReceipt.data;
      if (loTxReceipt.hasOwnProperty('status')){
        const txStatus = loTxReceipt.status;
        if (txStatus === true){
          loTxReceipt.status = 'mined';
        }else{
          loTxReceipt.status = 'failed';
        }
        return Promise.resolve(txReceipt);
      }else{
        return web3Interact.getTransaction(transactionHash)
          .then(function(tx){
            console.log("3. then of getTransaction",tx);
            if (tx){
              const txBlockNumber = tx.blockNumber;

              if (txBlockNumber){
                loTxReceipt.status = 'mined';
              }else{
                loTxReceipt.status = 'pending';
              }
            }else{
              loTxReceipt.status = 'invalid';
            }

            return Promise.resolve(responseHelper.successWithData(loTxReceipt));
          })
          .catch(function(){
            return Promise.resolve(txReceipt);
          })
      }
    };

    return web3Interact.getReceipt(transactionHash)
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
