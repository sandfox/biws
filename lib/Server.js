var Agent = require('yakaa');

var httpsRegex = /^https/;

/**
 * Representation of an application server of sorts
 * @param  {int}    port port the service listens on
 * @param  {string} host host the server is on
 * @param  {object} meta optional
 * @return {Server}      [description]
 */
var Server = module.exports = function(protocol, port, host, meta){

    var agent = createAgent(protocol);

    this.protocol = protocol
    this.port = port;
    this.host = host;
    this.meta = meta || {};
    this.agent = agent;
}

function createAgent(protocol){

    var agentType;

    if(httpsRegex.test(protocol)) {
        agentType = Agent.SSL;
    } else {
        agentType = Agent;
    }

    return new agentType({
        keepAlive: true,
        keepAliveTimeoutMsecs: 5000,
        maxSockets: 500
    })
}