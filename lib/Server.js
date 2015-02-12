var Agent = require('yakaa');

/**
 * Representation of an application server of sorts
 * @param  {int}    port port the service listens on
 * @param  {string} host host the server is on
 * @param  {object} meta optional
 * @return {Server}      [description]
 */
var Server = module.exports = function(protocol, port, host, meta){

    var agent = new Agent({
        keepAlive: true,
        keepAliveTimeoutMsecs: 5000,
        maxSockets: 500
    });

    this.protocol = protocol
    this.port = port;
    this.host = host;
    this.meta = meta || {};
    this.agent = agent;
}
