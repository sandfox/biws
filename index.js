var Server = require('./lib/Server');
var DefaultServerList = require('./lib/DefaultServerList');
var SeaportServerList = require('./lib/SeaportServerList');
var RoundRobinRule = require('./lib/rules/RoundRobin');
var RandomRule = require('./lib/rules/Random');
var DefaultLoadBalancer = require('./lib/DefaultLoadBalancer');
var HttpClient = require('./lib/client/Http');

module.exports = {
    Server: Server,
    DefaultServerList: DefaultServerList,
    SeaportServerList: SeaportServerList,
    RoundRobinRule: RoundRobinRule,
    RandomRule: RandomRule,
    DefaultLoadBalancer: DefaultLoadBalancer,
    HttpClient: HttpClient
}

/**
 * Creates an HTTP client with default rule, Default/Static Server List, and default loadbalancer
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
module.exports.createClient = function(opts){

    opts = opts || {};

    // if a loadBalancer is passed then we should not bother creating Rule + ServerList
    var rule = opts.rule || new RoundRobinRule();
    var serverList = opts.serverList || new DefaultServerList();
    var loadBalancer = opts.loadBalancer || new DefaultLoadBalancer(rule, serverList);

    var client = new HttpClient(loadBalancer);

    if(opts.servers) {
        opts.servers.forEach(function(srv){
            serverList.addServer(new Server(srv.protocol, srv.port, srv.host));
        })
    }

    return client;
};

