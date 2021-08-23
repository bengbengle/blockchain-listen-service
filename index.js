const express = require('express')
// 引入web库
var Web3 = require('web3');
var tokenAbi = require('./token.json')
var mineAbi = require('./mine.json')

const app = express()

//Infura Websockets connection.
const getProvider = () => {
    const provider = new Web3.providers.WebsocketProvider(
          "wss://exchaintestws.okex.org:8443"
        // "wss://exchainws.okex.org:8443"
    )
    provider.on("connect", () => {
        console.log("*** WebSocket Connected ***", Date.now().toString())
    })
    provider.on("error", (e) => {
        console.log("*** WebSocket Error ***", Date.now())
        getProvider()
    })
    provider.on("end", (e) => {
        console.log("*** WebSocket Ended ***", Date.now())
        getProvider()
    })
    provider.on("close", (e) => {
        console.log("*** WebSocket Closed ***", Date.now())
        getProvider()
    })
    provider.on("timeout", (e) => {
        console.log("*** WebSocket Timeout ***", Date.now())
        getProvider()
    })
    provider.on("exit", (e) => {
        console.log("*** WebSocket Exit ***", Date.now())
        getProvider()
    })
    provider.on("ready", (e) => {
        console.log('*** WebSocket Ready ***')
    })
    return provider
}

// 使用WebSocket协议 连接节点
let web3 = new Web3(getProvider());

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(8080, () => {
    console.log('Start Server, listening on port 3000!')
})

var subscription = web3.eth.subscribe('logs', {
    address: '0x2219845942d28716c0f7c605765fabdca1a7d9e0',
    // topics: ['0x12345...']
}, function(error, result){
    // console.log('result:', result);
})
.on("data", function(log){
    // console.log('data event:', log.transactionHash);
})
.on("changed", function(log){
});


const mineContract = new web3.eth.Contract(
    mineAbi,
    '0xAbE058f40f532749A180d83fCBf12D78E09606F2'
)
mineContract.events.Deposit(function (error, event) {
    if (error) {
        console.log(error);
    }
    // 打印出交易hash 及区块号
    console.log("交易hash:" + event.transactionHash);
    console.log("区块高度:" + event.blockNumber);

    //   获得监听到的数据：
    console.log("参与地址:" + event.returnValues );
    console.log("参与金额:" + event.transactionHash);

});