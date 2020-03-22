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
    if(root.getElementsByClassName("nutrition")[0].getElementsByClassName("nutrient").length == 0)
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
    for(var id in fcen)
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
            var nutNode = document.getElementById(i).getElementsByClassName("nutritionShow")[0].getElementsByClassName(nutId)[0];
            if(nutNode)
            {
                nutNode.classList.toggle("hidden");
            }
            else
            {
                var nutrient = fcen[i].nutrients[nutId];
                var nutData = { name : nutrient.name, value : nutrient.value, id: nutId}
                document.getElementById(i).getElementsByClassName("nutritionShow")[0].innerHTML += Mustache.render(nutrientTemplate, nutData);
            }
        }
    }
}

function hideNutrient()
{
    var nutId = event.target.parentNode.parentNode.getAttribute("data-nutid");
    if (event.target.checked)
    {
        var node = document.createElement('style');
        node.className=nutId;
        node.innerHTML=".aliment .nutrition ."+ nutId +" {display:none}";
        document.head.appendChild(node);
    }
    else
    {
        document.head.getElementsByClassName(nutId)[0].remove();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.innerHTML += Mustache.render(searchHtml, {nutrientNames : nutNamesHtml, aliments: alimHtml});
} , false);
