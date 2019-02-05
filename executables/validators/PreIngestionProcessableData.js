"use strict";

// Script will validate data from CSV and check if the amounts in it are still available for allocation from Trustee contract

const rootPrefix = '../..'
  , trusteeContractInteract = require(rootPrefix + '/lib/contract_interact/trustee')
  , BigNumber = require('bignumber.js')
;

const preIngestionProcessableDataVerifier = {

  perform: async function(filePath) {
    
    console.log('reading from file: ' + filePath);
    
    let csvData = await _private._readFromCsv(filePath);

    console.log('converting data from file: ' + filePath);
    
    let convertedCsvData = await _private._validateAndConvertInWei(csvData);

    console.log('converted data from file: ' + filePath);

    let problemFound = false;

    convertedCsvData.forEach(async function(row) {

      let address = row[0],
        amountToProcessInWei = row[1],
        amountEligibleToBeProcessedInWei,
        allocationsData
      ;

      console.log('checking for row: ', row.join(','));

      allocationsData = await trusteeContractInteract.getAllocationsData(address);
      console.log('address: ', address, allocationsData);

      amountEligibleToBeProcessedInWei = new BigNumber(allocationsData.amountGranted).minus(new BigNumber(allocationsData.amountTransferred));
      console.log('address: ', address, amountEligibleToBeProcessedInWei, amountToProcessInWei);

      if (amountToProcessInWei.isGreaterThan(amountEligibleToBeProcessedInWei)) {
        console.error('problem with address: ', address);
        problemFound = true;
      }

    });

    if (problemFound) {
      console.error('PROBLEMS FOUND IN SOME ADDRESSES ABOVE!!!!')
    } else {
      console.log('SUCCESS');
    }

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

