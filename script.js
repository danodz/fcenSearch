//var data = {};
//
//var foodRequest = new XMLHttpRequest();
//foodRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/food/?lang=fr&type=json", true);
//foodRequest.onload = function (e) {
//    if (foodRequest.readyState === 4 && foodRequest.status === 200)
//    {
//        foodData = JSON.parse(foodRequest.responseText);
//        for(var i = 0; i<foodData.length; i++)
//        {
//            data[foodData[i].food_code] = {name : foodData[i].food_description, nutrients:{}};
//        }
//    }
//}
//foodRequest.send(null);
//
//var nutRequest = new XMLHttpRequest();
//nutRequest.open("GET", "https://aliments-nutrition.canada.ca/api/fichier-canadien-elements-nutritifs/nutrientamount/?lang=fr&type=json", true);
//nutRequest.onload = function (e) {
//    if (nutRequest.readyState === 4 && nutRequest.status === 200)
//    {
//        nutData = JSON.parse(nutRequest.responseText);
//        for(var i = 0; i<nutData.length; i++)
//        {
//            data[nutData[i].food_code].nutrients[nutData[i].nutrient_web_name] = nutData[i].nutrient_value;
//        }
//        //init();
//    }
//}
//nutRequest.send(null);

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

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    }

    function receivedText(e) {
      let lines = e.target.result;
      var newArr = JSON.parse(lines); 
    }
}
