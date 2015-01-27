var DefaultLoadBalancer = module.exports = function(rule, serverList){

    this.rule = rule;
    this.serverList = serverList;
}


DefaultLoadBalancer.prototype.chooseServer = function() {
    return this.rule.choose(this.serverList);
};