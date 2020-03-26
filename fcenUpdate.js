const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
var fcen = {};
var nutrientNames = {};

var foodRequest = new XMLHttpRequest();
foodRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/food/?lang=fr&type=json", true);
foodRequest.onload = function (e) {
    if (foodRequest.readyState === 4 && foodRequest.status === 200)
    {
        var foodData = JSON.parse(foodRequest.responseText);
        for(var i = 0; i<foodData.length; i++)
        {
            fcen[foodData[i].food_code] = {name : foodData[i].food_description, nutrients:{}};
        }
        nutRequest.send(null);
    }
}

var nutRequest = new XMLHttpRequest();
nutRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/nutrientamount/?lang=fr&type=json", true);
nutRequest.onload = function (e) {
    if (nutRequest.readyState === 4 && nutRequest.status === 200)
    {
        var nutData = JSON.parse(nutRequest.responseText);
        for(var i = 0; i<nutData.length; i++)
        {
            fcen[nutData[i].food_code].nutrients["_" + nutData[i].nutrient_name_id] = nutData[i].nutrient_value;
        }
        fs.writeFile("fcen.json", JSON.stringify(fcen), () => {console.log("fcen.json")})
        fs.writeFile("fcen.js", "fcen = " + JSON.stringify(fcen) + ";", () => {console.log("fcen.js")})
        console.log("done");
    }
}
//foodRequest.send(null);

var nutrientGroups = {};
var nutGroupsRequest = new XMLHttpRequest();
nutGroupsRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/nutrientgroup/?lang=fr&type=json", true);
nutGroupsRequest.onload = function (e) {
    if (nutGroupsRequest.readyState === 4 && nutGroupsRequest.status === 200)
    {
        var groups = JSON.parse(nutGroupsRequest.responseText);
        for(i in groups)
        {
            var group = {}
            group.name = groups[i].nutrient_group_name;
            group.order = groups[i].nutrient_group_order;
            group.nutrients = [];
            nutrientGroups[groups[i].nutrient_group_id] = group;
        }
        nutNamesRequest.send(null);
    }
}
nutGroupsRequest.send(null);

var nutrientNames = {};
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
            var nutName = {
                id : "_"+name.nutrient_name_id,
                name : name.nutrient_web_name,
                unit : name.unit,
                group : name.nutrient_group_id
            };
            nutrientGroups[nutName.group].nutrients.push(nutName.id);
            nutrientNames[nutName.id] = nutName;
        }

        fs.writeFile("nutrientNames.js", "nutrientNames = " + JSON.stringify(nutrientNames) + ";", () => {console.log("nutrientNames.js")})
        fs.writeFile("nutrientNames.json", JSON.stringify(nutrientNames), () => {console.log("nutrientNames.json")});
        fs.writeFile("nutrientGroups.js", "nutrientGroups = " + JSON.stringify(nutrientGroups) + ";", () => {console.log("nutrientGroups.js")})
        fs.writeFile("nutrientGroups.json", JSON.stringify(nutrientGroups), () => {console.log("nutrientGroups.json")});
    }
}
