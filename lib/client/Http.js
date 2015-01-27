var http = require('http');
var https = require('https');
var url = require('url');
var events = require('events');

var _ = require('lodash');

/**
 * A load balancer aware http client
 * pretty much a wrapper on top of node http/https
 * @param  {[type]} loadBalancer [description]
 * @param  {[type]} opts         [description]
 * @return {[type]}              [description]
 */
var httpClient = module.exports = function(loadBalancer, opts){

    opts = opts || {};

    this.lb = loadBalancer;

}

httpClient.prototype.request = function(opts, cb){

    if(typeof opts === 'string'){
        opts = url.parse(opts);
    }

    // remove - host, localAddress, agent, hostname, port, socketPath
    // passthrough method, path, headers, auth
    // we provide agent, hostname, port
    
    // clone and remove stuff we don't like
    var options = _.chain(opts)
        .cloneDeep()
        .omit(['host', 'localAddress', 'agent', 'hostname', 'port', 'socketPath'])
        .value();

    // get a hostname/port from load balancer
    var server = this.lb.chooseServer();

    if (server == null){
        throw new Error('Unable to find a server to send the request to')
    };

    options.hostname = server.hostname;
    options.port = server.port;
    options.agent = server.agent;

    //one day we might have TLS/SPDY instances...
    return http.request(options, cb)

}