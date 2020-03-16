const http = require('http');
const fs = require('fs');
const mustache = require('mustache');

const hostname = '127.0.0.1';
const port = 3000;

const fcen = JSON.parse(fs.readFileSync('fcen.json'));

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
    else if(url.pathname == "/fcen/searchStatic")
    {
        fcenSearchStatic(res);
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
    var body = "";
    var alimentTemplate = fs.readFileSync("aliment.html").toString();
    var nutrientTemplate = fs.readFileSync("nutrient.html").toString();
    
        var max = 1500;
    for(id in fcen)
    {
            max -= 1;
        var nutrients = "";
        for(nutrient in fcen[id].nutrients)
        {
            nutrients += mustache.render(nutrientTemplate, {name : nutrient, value: fcen[id].nutrients[nutrient]});
        };
        body += mustache.render(alimentTemplate, {id : id, name : fcen[id].name, nutrients : nutrients});
            if(max <= 0)
                break;
    }

    var page = htmlPage(["script.js", "fcen.js"], ["styles.css"], "", body);
    fs.writeFileSync("fcen.html", page);
    res.statusCode = 200;
    res.end(page);
}

function fcenSearchStatic(res)
{
    res.statusCode = 200;
    res.end(fs.readFileSync("fcen.html"));
}

function htmlPage(scripts, styles, head, body)
{
    var content = {"scripts" : "", "styles" : "", "head" : head, "body": body};

    for(script of scripts)
    {
        content["scripts"] += fs.readFileSync(script).toString();
    }
    for(style of styles)
    {
        content["styles"] += fs.readFileSync(style).toString();
    }

    var page = fs.readFileSync('template.html').toString();
    page = mustache.render(page, content);
    return page;
    //<script src="script.js"></script>
    //<link rel="stylesheet" type="text/css" href="styles.css">
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
