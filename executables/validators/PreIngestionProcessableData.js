"use strict";

// Script will validate data from CSV and check if the amounts in it are still available for allocation from Trustee contract

const rootPrefix = '../..'
  , fs = require('fs')
  , parseCsv = require('csv-parse')
  , trusteeContractInteract = require(rootPrefix + '/lib/contract_interact/trustee')
  , BigNumber = require('bignumber.js')
;

const preIngestionProcessableDataVerifier = {

  perform: async function() {

    let filePath = './data/processable_allocations_in_st.csv';

    console.log('reading from file: ' + filePath);
    
    let csvData = await _private._readFromCsv(filePath);

    console.log('converting data from file: ' + filePath);
    
    let convertedCsvData = await _private._validateAndConvertInWei(csvData);

    console.log('converted data from file: ' + filePath);

    let problemFound = false;

    convertedCsvData.forEach(async function(row) {

      let address = row[0],
        amountToProcessInWei = row[1],
        oneSTWei = new BigNumber('1000000000000000000'),
        amountEligibleToBeProcessedInWei,
        allocationsData
      ;

      allocationsData = await trusteeContractInteract.getAllocationsData(address);

      amountEligibleToBeProcessedInWei = new BigNumber(allocationsData.amountGranted).minus(new BigNumber(allocationsData.amountTransferred));

      if (amountToProcessInWei.gt(amountEligibleToBeProcessedInWei)) {
        console.error(`------------------------------------`);
        console.error(`Address: ${address}`);
        console.error(`OST in CSV: ${amountToProcessInWei.div(oneSTWei).toString(10)}`);
        console.error(`OST remaining contract: ${amountEligibleToBeProcessedInWei.div(oneSTWei).toString(10)}`);
        console.error(`OST difference: ${amountToProcessInWei.minus(amountEligibleToBeProcessedInWei).div(oneSTWei).toString(10)}`);
        console.error(`Change OST in CSV to: ${amountEligibleToBeProcessedInWei.div(oneSTWei).toString(10)}`);
        problemFound = true;
      } else if (amountEligibleToBeProcessedInWei.minus(amountToProcessInWei).lt(oneSTWei) && amountEligibleToBeProcessedInWei.minus(amountToProcessInWei).toString(10) != 0) {
        console.error(`------------------------------------`);
        console.error(`Address: ${address}`);
        console.error(`OST in CSV: ${amountToProcessInWei.div(oneSTWei).toString(10)}`);
        console.error(`OST remaining contract: ${amountEligibleToBeProcessedInWei.div(oneSTWei).toString(10)}`);
        console.error(`OST difference: ${amountToProcessInWei.minus(amountEligibleToBeProcessedInWei).div(oneSTWei).toString(10)}`);
        console.error(`Change OST in CSV to: ${amountEligibleToBeProcessedInWei.div(oneSTWei).toString(10)}`);
        problemFound = true;
      }

    });

  }

};

const _private = {

  _readFromCsv: function (filePath) {

    return new Promise(function (onResolve, onReject) {

      let csvData = [];
      fs.createReadStream(filePath)
        .pipe(parseCsv({delimiter: ','}))
        .on('data', function (csvrow) {
          console.debug(csvrow);
          //Push Row(Array) to csvData
          csvData.push(csvrow);
        })
        .on('end', function () {
          onResolve(csvData);
        })
        .on('error', function (e) {
          console.error("Error: " + e + " in CSV parsing ");
          process.exit(1);
        });
    });

  },
  
  _validateAndConvertInWei: function(csvData) {

    return new Promise(function (onResolve, onReject) {

      let totalEntries = csvData.length;

      if (totalEntries == 0) {
        console.error("No data present in csv!");
        process.exit(1);
      }

      let convertedData = [];

      for (let i = 0; i < totalEntries; i++) {

        // Continue if blank value
        if (!csvData[i] || csvData[i] == '') {
          continue;
        }

        let rowData = csvData[i],
          userAddr = rowData[0].trim(),
          oneSTWei = new BigNumber('1000000000000000000'),
          amountInST = new BigNumber(rowData[1].trim()),
          amountInSTWei = amountInST.mul(oneSTWei);
        

        let buffer = [userAddr, amountInSTWei];

        convertedData.push(buffer);

      }

      onResolve(convertedData);

    });

  }

};

preIngestionProcessableDataVerifier.perform();

