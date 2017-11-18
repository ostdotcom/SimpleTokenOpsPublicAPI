const Web3 = require('web3')
  , web3RpcProvider = new Web3(process.env.ST_GETH_RPC_PROVIDER)
  , fs = require('fs')
  , parseCsv = require('csv-parse');

var ethereum_dict = {};

const fetchAllTransactionInfo = {

  getTransactions: async function(){

  await fetchAllTransactionInfo.readCsv();

  var startBlockNumber = await web3RpcProvider.eth.getBlockNumber();
  var endBlockNumber = startBlockNumber - 1000;

  for (var blockNo = startBlockNumber; blockNo >= endBlockNumber; blockNo--) {
    console.log("Fetching transaction of block "+blockNo);
    var blockTransactions = await fetchAllTransactionInfo.getBlockTransactions(blockNo);

    blockTransactions.forEach( function(transaction) {

      var from_address = transaction.from;
      var to_address = transaction.to;
      console.log("Transaction Value::"+transaction.value);
      if (blockNo == 2091278) {
        console.log(from_address+"==="+to_address);
        console.log(ethereum_dict[from_address])
      }

      if (from_address) {
        from_address = from_address.toLowerCase();
        if (ethereum_dict[from_address]) {
          console.log("Matched From address::"+ethereum_dict[from_address]);
          ethereum_dict[from_address].transaction_count += 1;
        }
      }

      if (to_address) {
        to_address = to_address.toLowerCase();
        if (ethereum_dict[to_address]) {
          console.log("Matched to address::"+ethereum_dict[to_address]);
          ethereum_dict[to_address].transaction_count += 1;
        }
      }
    });

  }

  fetchAllTransactionInfo.writeCsv();

},

readCsv: function() {

  return new Promise(function (onResolve, onReject) {

    fs.createReadStream("kyc_eth_address.csv")
      .pipe(parseCsv({delimiter: ','}))
      .on('data', function (csvrow) {
        console.log(csvrow);
        ethereum_dict[csvrow[1].toLowerCase()] = {email: csvrow[0], transaction_count: 0}
      })
      .on('end', function () {
        onResolve();
      })
      .on('error', function (e) {
        console.error("Error: " + e + " in CSV parsing ");
        process.exit(1);
      });
  });
},

getBlockTransactions: async function(blockNumber) {
  var block = await web3RpcProvider.eth.getBlock(blockNumber, true);
  return block.transactions;
},

writeCsv: function() {
  var stream = fs.createWriteStream("results.csv");
  stream.once('open', function(fd) {
    Object.keys(ethereum_dict).forEach(function(key) {
      var row = ethereum_dict[key];
      console.log(row);
      stream.write(row.email+",");
      stream.write(row.transaction_count);
      stream.write("\n");
    });
    stream.end();
  });
}

};

fetchAllTransactionInfo.getTransactions();
