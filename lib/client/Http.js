var http = require('http');
var https = require('https');
var url = require('url');

var request = require('request');
var _ = require('lodash');

/**
 * A load balancer aware http client
 * pretty much a wrapper on top of mikeals request
 * @param  {[type]} loadBalancer [description]
 * @param  {[type]} opts         [description]
 * @return {[type]}              [description]
 */
var HttpClient = module.exports = function(loadBalancer, opts){

    opts = opts || {};

    this.lb = loadBalancer;

}

// This naming is absymal - but better to have access and rename later
module.exports.request_module

/**
 * A wrapper around node's builtin http.request
 * @param  {[type]}   opts [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
HttpClient.prototype._request = function(opts, cb){

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

    options.hostname = server.host;
    options.port = server.port;
    options.agent = server.agent;


    //one day we might have TLS/SPDY instances...
    return http.request(options, cb)

}


HttpClient.prototype.request = function(opts, cb) {

    var uri; 
    
   if(typeof opts === 'string'){
        uri = url.parse(opts);
        opts = {
            uri: uri
        };
    }

    if(opts.url) {
        opts.uri = opt.url;
        delete opts.url; //this feels wrong
    }

    opts.uri = _.chain(opts.uri)
        .omit(['host', 'localAddress', 'agent', 'hostname', 'port', 'socketPath'])
        .value();

    // get a hostname/port from load balancer
    var server = this.lb.chooseServer();

    if (server == null){
        throw new Error('Unable to find a server to send the request to')
    };

    opts.uri.protocol = 'http:' //this should come from the server (currently)
    opts.uri.hostname = server.host
    opts.uri.port = server.port;
    opts.agent = server.agent;

    request(opts, cb);
};

