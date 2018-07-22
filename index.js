const child_process = require('child_process');
const http = require('http');
const url = require('url');

http.createServer((request, response) => {
    let url_parts = url.parse(request.url, true);
    let args = [];
    for (let p in url_parts.query) {
        args.push(`"--${p}"`);
        args.push(`"${url_parts.query[p]}"`);
    }
    args.push('> ./www/build.html');

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
        response.writeHead(500);
        response.end("" + error);
    }

    try {
        child_process.spawnSync(
            './build.sh',
            args,
            {
                shell: true,
            }
        )
    } catch(error) {
        response.writeHead(500);
        response.end("" + error);
    }

    response.writeHead(
        307,
        {
            'Location': 'http://localhost/build.html'
        }
    );
    response.end();
}).listen(
    49152
);