const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const data = fs.readFileSync('fcen.json')

const server = http.createServer((req, res) => {
    url = new URL(req.url, `http://${req.headers.host}`);
    if(url.pathname == "/fcen/raw")
    {
        fcenJson(res);
    }
    else if(url.pathname == "/fcen/search")
    {
        fcenSearch(res);
    }
    else
    {
        res.statusCode = 404;
        res.end("404");
    }
});

function fcenJson(res)
{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(data);
}

function fcenSearch(res)
{
    var page = fs.readFileSync('index.html')

    res.statusCode = 200;
    res.end(page);
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
