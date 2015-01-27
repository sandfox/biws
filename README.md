##

This a layer on top of the builtin `http.request` to handle load balancing etc. Most of the defaults apply.

You set the servers to use for requests, and then when making a request just supply the path+qs+headers.

_ While in pre 1.0.0 release just assume every version breaks things :-) _

## Usage

See '/scratch' for more. You'll probably interested in the seaport aware one.


```
var opts = {
    servers : [
        { host: 'localhost', port: 8000},
        { host: 'localhost', port: 8001}
    ]
}

var myServiceClient = biws.createClient(opts);

var someRequest = myServiceClient.request('/index', mycallback);

someRequest.end();



```

## NOTES

Clients have a LoadBalancer
LoadBalancers have a Rule (like round robin or round robin)
When a request gets made the loadbalancer gets a server from the serverList using a rule
Rules get passed a ServerList to pick from and return a server.

A valid 'ServerList' is any object with a 'getServers' method that return an array of 'Server'


## TODO

Write some unit tests.....

Making requests before SeaportServerList has synced will fail.
You can listen to SeaportServerList.port.on('synced') but that is derp...

HttpClient should just be a client and hide away HTTP/HTTPS/SPDY underneath.

Add in metrics.
Create a AWS AZ aware load balancer.
Abstract out dynamic/servie-discovery aware ServiceLists somehow.
Prime / prewarming connections
healthchecks?