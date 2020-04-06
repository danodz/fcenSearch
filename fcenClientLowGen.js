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

function nutrientValueHtml(alimId, nutId)
{
    if(fcen[alimId].nutrients[nutId] != undefined)
    {
        var nutrient = nutrientNames[nutId];
        nutrient.value = fcen[alimId].nutrients[nutId];
        return Mustache.render(nutrientTemplate, nutrient);
    }
    return "";
}

function toggleNuts()
{
    var nutrients = "";
    var root = event.target.parentNode.parentNode;
    var id = root.id
    var nutrition = root.getElementsByClassName("nutrition")[0];
    if(root.getElementsByClassName("nutrition")[0].getElementsByClassName("nutrient").length == 0)
    {
        for(var groupId in nutrientGroups)
        {
            var group = nutrientGroups[groupId];
            nutrients += Mustache.render(nutrientGroupTemplate, group);
            for(var nutId of group.nutrients)
            {
                nutrients += nutrientValueHtml(id, nutId);
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
    var caseSensible = document.getElementsByClassName("caseSensitivity")[0].checked;
    var search = caseSensible? document.getElementsByClassName("searchInput")[0].value:document.getElementsByClassName("searchInput")[0].value.toLowerCase();
    search = search.split(/[\s,]+/);
    var nutrients = {};

    var tresholds = document.getElementsByClassName("tresholds");
    for(var i=0; i<tresholds.length; i++)
    {
        var min = tresholds[i].getElementsByClassName("min")[0];
        var max = tresholds[i].getElementsByClassName("max")[0];
        if(min.value || max.value)
        {
            var id = tresholds[i].parentNode.getAttribute("data-nutid");
            nutrients[id] = {min : min.value ? min.value : 0, max : max.value ? max.value : Infinity};
        }
    }

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

function showNutrient()
{
    var nutId = event.target.parentNode.parentNode.getAttribute("data-nutid");
    var aliments = document.getElementsByClassName("aliment");
    for(i in fcen)
    {
        if(fcen[i].nutrients[nutId] != undefined)
        {
            var nutNode = document.getElementById(i).getElementsByClassName("nutritionShow")[0].getElementsByClassName(nutId)[0];
            if(nutNode)
            {
                nutNode.classList.toggle("hidden");
            }
            else
            {
                document.getElementById(i).getElementsByClassName("nutritionShow")[0].innerHTML += nutrientValueHtml(i, nutId);
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
