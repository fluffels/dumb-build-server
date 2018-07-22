const child_process = require('child_process');
const http = require('http');
const url = require('url');

http.createServer((request, response) => {
    if (request.method != 'GET') {
        response.writeHead(405);
        response.end();
        return;
    }

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
        console.error(error);
        response.writeHead(500);
        response.end();
        return;
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
        console.error(error);
        response.writeHead(500);
        response.end();
        return;
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