"use strict";

/**
 * error response code for failed transaction for web3
 * @type {{low_balance: string, wrong_nonce: string, known_transaction: string, transaction_underpriced: string}}
 */

const sendTransaction = {

  low_balance : 'low_eth_balance',

  // when error in nounce due to already mined transactions
  wrong_nonce : 'wrong_nonce',

  // when transaction is pending or queued and if any data(including gas price) is modified, but transaction cannot be resubmitted because gas price is still less than 110% of previous
  transaction_underpriced : 'transaction_underpriced',

  // when transaction is is pending or queued and resent again without gas price been modified
  known_transaction : 'known_transaction',

};

module.exports = sendTransaction;