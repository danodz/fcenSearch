var timestamp = new Date().getTime()
var body = '';
var alimentTemplate = '<div id="{{id}}" class="aliment"> <div class="basicInfo"> <div class="name inline"> {{name}} </div> <div class="showNuts inline"> Afficher les nuts </div> </div> <div class="nutrition hidden"> {{{nutrients}}} </div> </div>';

var nutrientTemplate = '<div class="nutrient inline"> <div class="name"> {{name}} </div> <div class="value"> {{value}} </div> </div>';


for(id in fcen)
{
    var nutrients = "";
    for(nutrient in fcen[id].nutrients)
    {
        nutrients += Mustache.render(nutrientTemplate, {name : nutrient, value: fcen[id].nutrients[nutrient]});
    };
    body += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name, nutrients : nutrients});
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.innerHTML = body;
    var finalTime = new Date().getTime();
    console.log(timestamp, finalTime, finalTime - timestamp);
}, false);
