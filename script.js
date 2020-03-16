function init()
{
    for(var id in data)
    {
        food=document.getElementById("foodTemplate").cloneNode(true);
        food.id = "";
        //food.querySelector(".");
        document.body.appendChild(food);
    }
}

function downloadObjectAsJson(exportObj, exportName)
{
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    // required for firefoxdownloadAnchorNode.click();downloadAnchorNode.remove();
}
}
