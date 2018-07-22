# Overview
This is a dumb build server.
Dumb in the sense of being minimal.
This server listens on a port and kicks off bash shell build scripts.
The scripts write to an HTML file that you can serve with NGINX or something similar.

# Installation
`npm install git+https://git@github.com/fluffels/dumb-build-server.git`

# Usage
`node node_modules/dumb-build-server/index.js &`

The build server will listen on port 49152 for HTTP requests.
When the build server receives an HTTP GET request it will execute `./build.sh` in the working directory.
This file is written by the user and performs the actual build.

The build server pipes output to `./www/<hash>.html`.
The `<hash>` part will be set to some unique value based on the build parameters and current time stamp.

Each request will receive a response that looks like this:

```
HTTP/1.1 307 Temporary Redirect
Location: https://<host>/<hash>.html
Date: Sun, 22 Jul 2018 21:32:26 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```

It's up to you to make sure this file is served correctly.
Something like [NGINX](http://nginx.org) is probably a good choice for this.

# Parameters

The build server passes GET parameters to `./build.sh`.
A request that looks like this:

`GET /?param1=test&param2=2`

...will result in a command-line call like this:

`./build.sh "--param" "test" "--param2" "2"`

Quotes are for preventing injection attacks.

# Configuration

This is a zero conf tool.
If you wish to change its behaviour, you can fork this repository and edit the code.

# Miscellaneous

## SystemD

Here is a SystemD unit file for the build server:

```
[Unit]
Description=Dumb build server
After=network.target
Requires=network.target

[Service]
Type=simple
ExecStart=/usr/bin/node /path/to/node_modules/dumb-build-server/index.js
WorkingDirectory=/path/to/
StandardError=syslog
NotifyAccess=all

[Install]
WantedBy=multi-user.target
```

##

Here is a sample NGINX configuration for serving the build output files:

```
server {
    listen 80;
    add_header X-Clacks-Overhead "GNU Terry Pratchett";
    add_header X-Robots-Tag "noindex, nofollow, nosnippet, noarchive";
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    add_header X-Clacks-Overhead "GNU Terry Pratchett";
    add_header X-Robots-Tag "noindex, nofollow, nosnippet, noarchive";

    ssl_certificate /etc/ssl/private/certificate.pem;
    ssl_certificate_key /etc/ssl/private/private.pem;
    # See https://wiki.mozilla.org/Security/Server_Side_TLS
    ssl_protocols TLSv1.2;
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256;

    root /srv/www;
}
```
