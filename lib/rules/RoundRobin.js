/**
 * simple round robin load balancer - default
 */

var RoundRobinRule = module.exports = function(lb){

    this.lb = lb;
    this.nextIndex = 0;
}


RoundRobinRule.prototype.choose = function(serverList) {
    
    //lb get server list
    var servers = serverList.getServers();

    if(servers.length < 1){
        //we have no servers, byyyeeee
        return null
    }

    var idx = this.nextIndex++ % servers.length;

    return servers[idx];

};