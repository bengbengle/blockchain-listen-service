const web3 = require("web3");
let hasProviderEnded = false, web3Instance, reconnectInterval = 10000;

async function newConnection(webSocketProvider, endCallback) {

    const options = {
        timeout: 30000, // ms

        clientConfig: {
            // Useful if requests are large
            maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
            maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

            // Useful to keep a connection alive
            keepalive: true,
            keepaliveInterval: -1 // ms
        },

        // Enable auto reconnection
        reconnect: {
            auto: true,
            delay: 1000, // ms
            maxAttempts: 10,
            onTimeout: false
        }
    };

    // create new provider 
    const provider = new web3.providers.WebsocketProvider(webSocketProvider, options);
    hasProviderEnded = false;

    // connect event fires when the connection established successfully. 
    provider.on('connect', () => console.log("connected to blockchain"));

    // error event fires whenever there is an error response from blockchain and this event also has an error object and message property of error gives us the specific reason for the error 
    provider.on('error', (err) => console.log(err.message));

    // end event fires whenever the connection end is detected. So Whenever this event fires we will try to reconnect to blockchain 
    provider.on('end', async (err) => {
        // handle multiple event calls sent by Web3JS library  
        if (hasProviderEnded) return;

        // setting hashProviderEnded to true as sometimes the end event is fired multiple times by the provider 
        hasProviderEnded = true;

        // reset the current provider  
        provider.reset();
        // removing all the listeners of provider. 
        provider.removeAllListeners("connect");
        provider.removeAllListeners("error");
        provider.removeAllListeners("end");

        setTimeout(() => {
            // emitting the restart event after some time to allow blockchain to complete startup 
            // we are listening to this event in the other file and this callback will initialize a new connection 
            endCallback();
        }, reconnectInterval);
    });

    if (web3Instance == undefined) web3Instance = new web3(provider);
    else web3Instance.setProvider(provider);
    return web3Instance;
}

module.exports = {
    newConnection
}