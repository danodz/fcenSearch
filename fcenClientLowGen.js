var nutNamesHtml = "";
for(var id in nutrientNames)
{
    var name = nutrientNames[id].nutrient_web_name;
    nutNamesHtml += Mustache.render(nutrientNameTemplate, {name : name});
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
        for(nutrient in fcen[id].nutrients)
        {
            nutrients += Mustache.render(nutrientTemplate, {name : nutrient, value: fcen[id].nutrients[nutrient]});
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
    for(id in fcen)
    {
        var name = caseSensible? fcen[id].name:fcen[id].name.toLowerCase();
        if(name.includes(search))
        {
            document.getElementById(id).style.display = 'block'
        }
        else
        {
            document.getElementById(id).style.display = 'none'
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.innerHTML += Mustache.render(searchHtml, {nutrientNames : nutNamesHtml, aliments: alimHtml});
} , false);
