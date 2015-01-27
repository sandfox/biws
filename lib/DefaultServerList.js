var _ = require('lodash');
var Server = require('./Server');

/**
 * Server lists are wrapper around the array of servers and how they are upated etc.
 * @return {[type]} [description]
 */
var DefaultServerList = module.exports = function(){

    this._servers = [];
}

/**
 * One day the underlying implementation of server storage will get messier
 * As long as this function always returns an array of 'Server' we're cool
 * @return {[type]} [description]
 */
DefaultServerList.prototype.getServers = function() {
    
    return this._servers;
};

/**
 * Add a server to the list - expects a 'Server'
 * @param {[type]} server [description]
 */
DefaultServerList.prototype.addServer = function(server) {
    this._servers.push(server);
};

DefaultServerList.prototype.removeServer = function(server) {
    _.remove(server, this._servers);
}