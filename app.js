const http = require('http');
const fs = require('fs');
const Mustache = require('mustache');
const minify = function(str)
{
    return require('html-minifier').minify(str, {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    sortAttributes: true,
    sortClassName: true,
    });
}

const hostname = '127.0.0.1';
const port = 3000;

const fcen = JSON.parse(fs.readFileSync('fcen.json'));

const server = http.createServer((req, res) => {
    url = new URL(req.url, `http://${req.headers.host}`);
    if(url.pathname == "/fcen/raw")
    {
        fcenJson(res);
    }
    if(url.pathname == "/fcen/clientLowGen")
    {
        clientLowGen(res);
    }
    else if(url.pathname == "/fcen/serverGen")
    {
        fcenServerGen(res);
    }
    else if(url.pathname == "/fcen/staticFile")
    {
        fcenStaticFile(res);
    }
    else if(url.pathname == "/fcen/staticMinFile")
    {
        fcenStaticMinFile(res);
    }
    else if(url.pathname == "/fcen/clientGen")
    {
        fcenClientGen(res);
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

function clientLowGen(res)
{
    var head = "<script>"
    head += "var alimentTemplate = '" + minify(fs.readFileSync("aliment.html").toString()) + "';";
    head += "var nutrientTemplate = '" + minify(fs.readFileSync("nutrient.html").toString()) + "';";
    head += "</script>"

    var page = htmlPage(["mustache.js", "fcen.js", "fcenClientLowGen.js"], ["styles.css"], head, fs.readFileSync("search.html").toString());

    res.statusCode = 200;
    res.end(page);
}

function fcenServerGen(res)
{
    var body = "";
    var alimentTemplate = fs.readFileSync("aliment.html").toString();
    var nutrientTemplate = fs.readFileSync("nutrient.html").toString();
    
    for(id in fcen)
    {
        var nutrients = "";
        for(nutrient in fcen[id].nutrients)
        {
            nutrients += Mustache.render(nutrientTemplate, {name : nutrient, value: fcen[id].nutrients[nutrient]});
        };
        body += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name, nutrients : nutrients});
    }

    var page = htmlPage(["script.js", "fcen.js"], ["styles.css"], "", body);
    fs.writeFileSync("fcen.html", page);
    res.statusCode = 200;
    res.end(page);
}

function fcenStaticFile(res)
{
    res.statusCode = 200;
    res.end(fs.readFileSync("fcen.html"));
}
function fcenStaticMinFile(res)
{
    res.statusCode = 200;
    res.end(fs.readFileSync("fcenMin.html"));
}
function fcenClientGen(res)
{
    res.statusCode = 200;
    var page = htmlPage(["mustache.js", "fcen.js", "fcenClientGen.js"], ["styles.css"], "", "");
    res.end(page);
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
    page = Mustache.render(page, content);
    return page;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
