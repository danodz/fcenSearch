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
    measures = "";
    for(var i=0; i<fcen[id].measures.length; i++)
    {
        measures += Mustache.render(measureHtml, fcen[id].measures[i]);
    }
    alimHtml += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name, measures : measures});
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
    var root = event.target.closest(".aliment");
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
        updateMeasure(root);
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
    var include = document.getElementsByClassName("searchInclude")[0].value.toLowerCase();
    include = include.split(/[\s,]+/);

    var exclude = document.getElementsByClassName("searchExclude")[0].value.toLowerCase();
    exclude = exclude.split(/[\s,]+/);

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

        for(var i=0; i<include.length; i++)
        {
            if(!name.includes(include[i]))
            {
                match = false;
                break;
            }
            for(var i=0; i<exclude.length; i++)
            {
                if(exclude[i] != "" && name.includes(exclude[i]))
                {
                    match = false;
                    break;
                }
            }
            if(!match)
                break;
            for(var n in nutrients)
            {
                if(fcen[id].nutrients[n] == undefined || fcen[id].nutrients[n] > nutrients[n].max || fcen[id].nutrients[n] < nutrients[n].min )
                {
                    match = false;
                    break;
                }
            }
            if(!match)
                break;
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

function updateMeasure(root)
{
    var factor = root.getElementsByClassName("measure")[0].value/100;
    var nutrients = root.getElementsByClassName("nutrient");
    for(var i=0; i<nutrients.length; i++)
    {
        var nutrient = nutrients[i];
        nutrient.getElementsByClassName("customValue")[0].innerHTML = fcen[root.id].nutrients["_" + nutrient.className.split("_")[1].split(" ")[0]] * factor;
    }
}

function measureInput()
{
    updateMeasure(event.target.closest(".aliment"));
}

function measureBtn(factor)
{
    event.target.parentElement.getElementsByClassName("measure")[0].value = factor;
    updateMeasure(event.target.closest(".aliment"));
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
                root.getElementsByClassName("nutritionShow")[0].innerHTML += nutrientValueHtml(i, nutId);
            }
            updateMeasure(root);
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
