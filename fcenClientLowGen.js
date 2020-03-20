var nutNamesHtml = "";
for(var id in nutrientNames)
{
    var nutrient = nutrientNames[id];
    nutNamesHtml += Mustache.render(nutrientNameTemplate, {name : nutrient.nutrient_web_name, id: nutrient.nutrient_name_id});
}

var alimHtml = "";
for(var id in fcen)
{
    alimHtml += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name});
}


function toggleNuts()
{
    var root = event.target.parentNode.parentNode;
    var id = root.id
    var nutrients = "";
    var nutrition = root.getElementsByClassName("nutrition")[0];
    if(root.getElementsByClassName("nutrient").length == 0)
    {
        for(nutId in fcen[id].nutrients)
        {
            var nutrient = fcen[id].nutrients[nutId];
            nutrients += Mustache.render(nutrientTemplate, {name : nutrient.name, value: nutrient.value, id: nutId});
        };
        nutrition.innerHTML = nutrients;
    }
    else
    {
        nutrition.classList.toggle("hidden");
    }
}

function toggleFilter()
{
    document.getElementsByClassName("nutrientFilters")[0].classList.toggle("hidden");
}

function filterFoodName()
{
    var caseSensible = document.getElementsByClassName("caseSensitivity")[0].checked;
    var search = caseSensible? document.getElementsByClassName("searchInput")[0].value:document.getElementsByClassName("searchInput")[0].value.toLowerCase();
    search = search.split(/[\s,]+/);
    for(id in fcen)
    {
        var name = caseSensible? fcen[id].name:fcen[id].name.toLowerCase();
        var match = true;
        for(i in search)
        {
            if(!name.includes(search[i]))
            {
                match = false;
            }
        }

        if(match)
        {
            document.getElementById(id).style.display = 'block'
        }
        else
        {
            document.getElementById(id).style.display = 'none'
        }
    }
}

function showNutrient()
{
    var nutId = event.target.parentNode.parentNode.getAttribute("data-nutid");
    var aliments = document.getElementsByClassName("aliment");
    for(i in fcen)
    {
        if(fcen[i].nutrients[nutId])
        {
            var nutrient = fcen[i].nutrients[nutId];
            var nutData = { name : nutrient.name, value : nutrient.value, id: nutId}
            document.getElementById(i).getElementsByClassName("nutritionShow")[0].innerHTML += Mustache.render(nutrientTemplate, nutData);
        }
    }
}

function hideNutrient()
{
    var id = event.target.parentNode.parentNode.id;
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.innerHTML += Mustache.render(searchHtml, {nutrientNames : nutNamesHtml, aliments: alimHtml});
} , false);
