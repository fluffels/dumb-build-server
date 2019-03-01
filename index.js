const child_process = require('child_process');
const http = require('http');
const url = require('url');
const port = 49152;

http.createServer((request, response) => {
    if (request.method != 'GET') {
        response.writeHead(405);
        response.end();
        return;
    }

    let url_parts = url.parse(request.url, true);
    let args = [];
    for (let p in url_parts.query) {
        let param_key = p;
        let param_value = url_parts.query[p];
        let whitelist = (s) => {
            let re = /[^A-Za-z0-9\-]/g;
            if (s.search(re) !== -1) {
                response.writeHead(400);
                response.end("Illegal argument: only characters A-Z, a-z, 0-9, and - are allowed.")
            }
        };
        whitelist(param_key);
        whitelist(param_value);
        args.push(`"--${param_key}"`);
        args.push(`"${param_value}"`);
    }
    args.push('| aha > ./www/build.html');

    console.log(`Received: ${request.url}`);

    try {
        child_process.spawnSync(
            'mkdir',
            [
                './www'
            ],
            {
                shell: true,
            }
        )
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        response.end();
        return;
    }

    try {
        child_process.spawn(
            './build.sh',
            args,
            {
                shell: true,
            }
        )
    } catch(error) {
        console.error(error);
        response.writeHead(500);
        response.end();
        return;
    }

    let host = request.headers.host;
    host = host.slice(0, host.indexOf(':'));
    response.writeHead(
        307,
        {
            'Location': `https://${host}/build.html`
        }
    );
    response.end();
}).listen(
    port
);

console.log(`Listening on ${port}...`);
