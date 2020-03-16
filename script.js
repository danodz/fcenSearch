function search(str)
{
    for(id in fcen)
    {
        var name = fcen[id].name;
        if(name.toLowerCase().includes(str.toLowerCase()))
        {
            document.getElementById(id).style.display = "block"
        }
        else
        {
            document.getElementById(id).style.display = "none"
        }
    }
}
