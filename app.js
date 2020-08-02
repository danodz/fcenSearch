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

const server = http.createServer((req, res) => {
    url = new URL(req.url, `http://${req.headers.host}`);
    if(url.pathname == "/fcen/search")
    {
        fcenSearch(res);
    } else
    {
        res.statusCode = 404;
        res.end("404");
    }
});

function fcenSearch(res)
{
    var head = "<script>"
    head += "var alimentTemplate = '" + minify(fs.readFileSync("aliment.html").toString()) + "';";
    head += "var nutrientTemplate = '" + minify(fs.readFileSync("nutrient.html").toString()) + "';";
    head += "var nutrientNameTemplate = '" + minify(fs.readFileSync("nutrientName.html").toString()) + "';";
    head += "var nutrientGroupTemplate = '" + minify(fs.readFileSync("nutrientGroup.html").toString()) + "';";
    head += "var searchHtml = '" + minify(fs.readFileSync("search.html").toString()) + "';";
    head += "var measureHtml = '" + minify(fs.readFileSync("measure.html").toString()) + "';";
    head += "</script>"

    var page = htmlPage(["mustache.js", "fcen.js", "nutrientNames.js", "nutrientGroups.js", "fcenSearch.js", "anref.js"], ["styles.css"], head, "");

    fs.writeFileSync("../danodz.github.io/index.html", page);
    res.statusCode = 200;
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
