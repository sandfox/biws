##

This a layer on top of the builtin `http.request` and mikeals's `request` to handle load balancing etc. Most of the defaults apply.


_ While in pre 1.0.0 release just assume every version breaks things :-) _

## Usage


```
var opts = {
    servers : [
        { protocol: 'http', host: 'localhost', port: 8000},
        { protocol: 'http', host: 'localhost', port: 8001}
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

- Making requests before SeaportServerList has synced will fail.
  You can listen to SeaportServerList.port.on('synced') but that is derp...

- HttpClient should just be a client and hide away HTTP/HTTPS/SPDY underneath.
- Agent can probably handle this abstraction fun for us (and connection priming)

- Add in metrics.
- Create a AWS AZ aware load balancer.
- Abstract out dynamic/servie-discovery aware ServiceLists somehow.
- Prime / prewarming connections
- Healthchecks?
- Make alot of things configurable

The seaport server list is too strongly tied to seaport, seaport goes down, everything goes down...
Maybe we should cache the list, or make the serverList updater a seperate module...