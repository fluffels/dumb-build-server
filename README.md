# dumb-build-server
Dumb NodeJS build server.

# Installation
`npm install git+https://git@github.com/fluffels/dumb-build-server.git`

# Usage
`node node_modules/dumb-build-server/index.js &`

The build server will listen on port 49152 for HTTP requests.
When the build server receives an HTTP GET request it will execute `./build.sh` in the working directory.
This file is written by the user and performs the actual build.

The build server pipes output to `./www/<hash>.html`.
The `<hash>` part will be set to some unique value based on the build parameters and current time stamp.

# Parameters

The build server passes GET parameters to `./build.sh`.
A request that looks like this:

`GET /?param1=test&param2=2`

...will result in a command-line call like this:

`./build "--param" "test" "param2" "2"`

Quotes are for preventing injection attacks.
