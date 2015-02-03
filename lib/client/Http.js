var http = require('http');
var https = require('https');
var url = require('url');

var request = require('request');

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
    ['host', 'localAddress', 'agent', 'hostname', 'port', 'socketPath'].forEach(function(key){
        delete opts.uri[key];
    })

    // get a hostname/port from load balancer
    var server = this.lb.chooseServer();

    if (server == null){
        throw new Error('Unable to find a server to send the request to')
    };

    opts.hostname = server.host;
    opts.port = server.port;
    opts.agent = server.agent;


    //one day we might have TLS/SPDY instances...
    return http.request(opts, cb)

}


HttpClient.prototype.request = function(opts, cb) {

    // opts can be a string...    
    if(typeof opts === 'string') {
        opts = {
            uri: url.parse(opts)
        };
    }

    if(opts.url) {
        opts.uri = opts.url;
        delete opts.url; //this feels wrong
    }

    //opts.uri could have been supplied as string
    if(typeof opts.uri === 'string') {
        opts.uri = url.parse(opts.uri);
    }

    ['host', 'localAddress', 'agent', 'hostname', 'port', 'socketPath'].forEach(function(key){
        delete opts.uri[key];
    })

    // get a hostname/port from load balancer
    var server = this.lb.chooseServer();

    if (server == null){
        throw new Error('Unable to find a server to send the request to')
    };

    opts.uri.protocol = 'http:' //this should come from the server/agent or somewhere else
    opts.uri.hostname = server.host
    opts.uri.port = server.port;

    // looks like we need to turn URI back into a string again...
    // because https://github.com/request/request/issues/1399
    // (aka don't build uri object from hand for other libraries)
    opts.uri = url.format(opts.uri);

    opts.agent = server.agent;

    request(opts, cb);
};

