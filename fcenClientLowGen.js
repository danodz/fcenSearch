var body = '';


for(id in fcen)
{
    body += Mustache.render(alimentTemplate, {id : id, name : fcen[id].name});
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.innerHTML = body;
}, false);
