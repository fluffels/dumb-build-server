const child_process = require('child_process');
const http = require('http');

const server = http.createServer((request, response) => {
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
            [
                '> ./www/build.html'
            ],
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