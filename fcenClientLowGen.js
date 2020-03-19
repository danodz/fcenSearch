var body = '';


for(id in fcen)
{
    body += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name});
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

function filterFoodName()
{
    for(id in fcen)
    {
        if(fcen[id].name.includes(event.target.value))
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
    document.body.innerHTML += body;
} , false);
