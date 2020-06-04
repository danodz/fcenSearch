var nutNamesHtml = "";
for(var groupId in nutrientGroups)
{
    var group = nutrientGroups[groupId];
    nutNamesHtml += Mustache.render(nutrientGroupTemplate, group);
    for(var nutId in group.nutrients)
    {
        nutNamesHtml += Mustache.render(nutrientNameTemplate, nutrientNames[group.nutrients[nutId]]);
    }
}

var alimHtml = "";
for(var id in fcen)
{
    alimHtml += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name});
}

function nutrientValueHtml(alimId, nutId, multiplier)
{
    if(fcen[alimId].nutrients[nutId] != undefined)
    {
        var nutrient = nutrientNames[nutId];
        nutrient.value = fcen[alimId].nutrients[nutId];
        nutrient.customValue = fcen[alimId].nutrients[nutId] * multiplier;
        return Mustache.render(nutrientTemplate, nutrient);
    }
    return "";
}

function toggleNuts()
{
    var nutrients = "";
    var root = event.target.closest(".aliment");
    var id = root.id
    var nutrition = root.getElementsByClassName("nutrition")[0];
    var multiplier = root.getElementsByClassName("setWeight")[0].value/100;
    if(root.getElementsByClassName("nutrition")[0].getElementsByClassName("nutrient").length == 0)
    {
        for(var groupId in nutrientGroups)
        {
            var group = nutrientGroups[groupId];
            nutrients += Mustache.render(nutrientGroupTemplate, group);
            for(var nutId of group.nutrients)
            {
                nutrients += nutrientValueHtml(id, nutId, multiplier);
            }
        }
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

function filterFoods()
{
    var search = document.getElementsByClassName("searchInput")[0].value.toLowerCase();
    search = search.split(/[\s,]+/);
    var nutrients = {};

    var tresholds = document.getElementsByClassName("tresholds");
    for(var i=0; i<tresholds.length; i++)
    {
        var min = tresholds[i].getElementsByClassName("min")[0];
        var max = tresholds[i].getElementsByClassName("max")[0];
        if(min.value || max.value)
        {
            var id = tresholds[i].closest(".nutrient").getAttribute("data-nutid");
            nutrients[id] = {min : min.value ? min.value : 0, max : max.value ? max.value : Infinity};
        }
    }

    for(var id in fcen)
    {
        var name = fcen[id].name.toLowerCase();
        var match = true;
        for(i in search)
        {
            if(!name.includes(search[i]))
            {
                match = false;
            }
            for(var n in nutrients)
            {
                if(fcen[id].nutrients[n] == undefined || fcen[id].nutrients[n] > nutrients[n].max || fcen[id].nutrients[n] < nutrients[n].min )
                {
                    match = false;
                }
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

function updateWeight()
{
    var root = event.target.closest(".aliment");
    var nutrients = root.getElementsByClassName("nutrient");
    for(var i=0; i<nutrients.length; i++)
    {
        var nutrient = nutrients[i];
        nutrient.getElementsByClassName("customValue")[0].innerHTML = fcen[root.id].nutrients["_" + nutrient.className.split("_")[1].split(" ")[0]] * event.target.value/100;
    }
}

function showNutrient()
{
    var nutId = event.target.closest(".nutrient").getAttribute("data-nutid");
    var aliments = document.getElementsByClassName("aliment");
    for(i in fcen)
    {
        if(fcen[i].nutrients[nutId] != undefined)
        {
            var root = document.getElementById(i)
            var nutNode = root.getElementsByClassName("nutritionShow")[0].getElementsByClassName(nutId)[0];
            if(nutNode)
            {
                nutNode.classList.toggle("hidden");
            }
            else
            {
                var multiplier = root.getElementsByClassName("setWeight")[0].value/100;
                root.getElementsByClassName("nutritionShow")[0].innerHTML += nutrientValueHtml(i, nutId, multiplier);
            }
        }
    }
}

function hideNutrient()
{
    var nutId = event.target.closest(".nutrient").getAttribute("data-nutid");
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
