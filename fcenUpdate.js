const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
var data = {};

var nutRequest = new XMLHttpRequest();
nutRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/nutrientamount/?lang=fr&type=json", true);
nutRequest.onload = function (e) {
    if (nutRequest.readyState === 4 && nutRequest.status === 200)
    {
        nutData = JSON.parse(nutRequest.responseText);
        for(var i = 0; i<nutData.length; i++)
        {
            data[nutData[i].food_code].nutrients[nutData[i].nutrient_name_id] = {value : nutData[i].nutrient_value, name : nutData[i].nutrient_web_name};
        }
        fs.writeFileSync("fcenV2.json", JSON.stringify(data))
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
            data[foodData[i].food_code] = {name : foodData[i].food_description, nutrients:{}};
        }
        nutRequest.send(null);
    }
}
foodRequest.send(null);
