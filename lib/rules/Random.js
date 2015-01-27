var RandomRule = module.exports =function(){}

RandomRule.prototype.choose = function(serverList) {
    
    var servers = serverList.getServers();
    var serverCount = servers.length;

    if(serverCount < 1) {
        return null;
    }

    var idx = Math.floor(Math.random() * serverCount)

    return servers[idx];

};