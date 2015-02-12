var url = require('url');
var seaport = require('seaport');
var _  = require('lodash');
var Server = require('./Server');


/**
 * Seaport aware server list that dynmically updates itself
 * @param  {object} opts [description]
 * @return {[type]}      [description]
 */
var SeaportServerList = module.exports = function(opts){

    this._servers = [];

    opts = opts || {};

    if(!opts.seaport){
        throw new Exception('"opts.seaport" must be a seaport instance or URL for one');
    }

    if(!opts.service || typeof opts.service !== 'string'){
        throw new Exception('"opts.service" must be string to filter seaport registrations against');
    }

    this.service = opts.service;

    this.port = (typeof opts.seaport === 'string') ? createPortFromUri(opts.seaport) : opts.seaport;

    // this will get slow with alot of seaport listeners
    // should create a "seaport manager" which looks after all these lists and has the only event listeners
    this.port.on('register', this._register.bind(this));

    this.port.on('free', this._free.bind(this));
}

SeaportServerList.prototype._register = function(registration) {

    var self = this;

    if(registration.role !== self.service){
        return;
    }

    var server = new Server(
        registration.protocol,
        registration.port, 
        registration.host,
        {
            id: registration.id,
            version: registration.version
        })

    self._servers.push(server);

};

SeaportServerList.prototype._free = function(registration) {
    
    var self = this;

    if(registration.role !== self.service) {
        return;
    }

    _.remove(self._servers, {meta:{id:registration.id}});
};

SeaportServerList.prototype.getServers = function() {
    return this._servers;
};

function createPortFromUri(uri){

    var parts = url.parse(uri);

    return seaport.connect(parts.port, parts.hostname);

}