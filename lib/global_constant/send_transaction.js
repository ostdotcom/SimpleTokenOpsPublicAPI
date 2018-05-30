"use strict";

/**
 * error response code for failed transaction for web3
 * @type {{low_balance: string, wrong_nonce: string, known_transaction: string, transaction_underpriced: string}}
 */

const sendTransaction = {

  low_balance : 'low_eth_balance',

  wrong_nonce : 'wrong_nonce',

  known_transaction : 'known_transaction',

  transaction_underpriced : 'transaction_underpriced',

};

module.exports = sendTransaction;