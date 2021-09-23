const Web3 = require("web3");
const connection = require("./connect.js");

const websocketUrl = 'wss://exchaintestws.okex.org:8443';

var web3 = new Web3(websocketUrl);

const endCallback = async function () {
    web3 = await connection.newConnection(websocketUrl, endCallback);
}

connection.newConnection(websocketUrl, endCallback)
.then(res => {
    web3 = res

    web3.eth.subscribe('logs', {
    
    }, function (error, result) {
        console.log('result:', result.blockNumber);
    })
    
    .on("data", function (log) {
        console.log('data event:', log.transactionHash);
    })

    .on("changed", function (log) {

    })
})

web3.eth.subscribe('logs', {
    
}, function (error, result) {
    console.log('result1111:', result.blockNumber);
})

.on("data", function (log) {
    console.log('data event1111:', log.transactionHash);
})

.on("changed", function (log) {

})