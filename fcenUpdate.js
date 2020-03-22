const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
var fcen = {};
var nutrientNames = {};

var nutRequest = new XMLHttpRequest();
nutRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/nutrientamount/?lang=fr&type=json", true);
nutRequest.onload = function (e) {
    if (nutRequest.readyState === 4 && nutRequest.status === 200)
    {
        nutData = JSON.parse(nutRequest.responseText);
        for(var i = 0; i<nutData.length; i++)
        {
            fcen[nutData[i].food_code].nutrients["_" + nutData[i].nutrient_name_id] = {value : nutData[i].nutrient_value, name : nutData[i].nutrient_web_name};
        }
        fs.writeFileSync("fcen.json", JSON.stringify(fcen))
        fs.writeFileSync("fcen.js", "fcen = " + JSON.stringify(fcen) + ";")
        console.log("done");
    }
}

var foodRequest = new XMLHttpRequest();
foodRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/food/?lang=fr&type=json", true);
foodRequest.onload = function (e) {
    if (foodRequest.readyState === 4 && foodRequest.status === 200)
    {
        foodData = JSON.parse(foodRequest.responseText);
        for(var i = 0; i<foodData.length; i++)
        {
            fcen[foodData[i].food_code] = {name : foodData[i].food_description, nutrients:{}};
        }
        nutRequest.send(null);
    }
}
foodRequest.send(null);


var nutNamesRequest = new XMLHttpRequest();
nutNamesRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/nutrientname/?lang=fr&type=json", true);
nutNamesRequest.onload = function (e) {
    if (nutNamesRequest.readyState === 4 && nutNamesRequest.status === 200)
    {
        var names = JSON.parse(nutNamesRequest.responseText);
        names.sort((a, b) => (a.nutrient_web_order > b.nutrient_web_order) ? 1 : -1)

        for(i in names)
        {
            var name = names[i];
            name.nutrient_name_id = "_"+name.nutrient_name_id;
            name.nutrient_code = "_"+name.nutrient_code;
        }

        fs.writeFileSync("nutrientNames.js", "nutrientNames = " + JSON.stringify(names) + ";")
        fs.writeFileSync("nutrientNames.json", JSON.stringify(names))
        console.log("done");
    }
}
nutNamesRequest.send(null);
