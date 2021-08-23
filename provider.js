const Web3 = require("web3")

//Infura Websockets connection.
var getProvider = () => {
  const provider = new Web3.providers.WebsocketProvider(
    "wss://ropsten.infura.io/ws/v3/xxx"
  )
  provider.on("connect", () => {
    console.log("*** WebSocket Connected ***")
  })
  provider.on("error", (e) => {
    console.log("*** WebSocket Error ***")
    getProvider()
  })
  provider.on("end", (e) => {
    console.log("*** WebSocket Ended ***")
    getProvider()
  })
  provider.on("close", (e) => {
    console.log("*** WebSocket Closed ***")
    getProvider()
  })
  provider.on("timeout", (e) => {
    console.log("*** WebSocket Timeout ***")
    getProvider()
  })
  provider.on("exit", (e) => {
    console.log("*** WebSocket Exit ***")
    getProvider()
  })
  provider.on("ready", (e) => {
    //console.log('*** WebSocket Ready ***')
  })
  return provider
}

var web3 = new Web3(getProvider())