document.addEventListener("DOMContentLoaded",function()
{
fetch('statistics.php')
.then(response=>response.json())
.then(data=> {

    if(data.empty==true)
    {
        console.error("Грешни данни при зареждане",data);
        return;
    }
    
    document.getElementById('total-coins').innerText=data.total_coins || 0;
    document.getElementById('total-value').innerText=(data.total_value || 0).toFixed(2) + "лв";
    
    const continentStatistics=document.getElementById("continent-statistics");
    continentStatistics.innerHTML="";
    if(!data.country_data ||data.continent_data.length === 0)
    {
        continentStatistics.innerHTML="<p>Няма монети по континенти</p>";
    }
    else{
        data.continent_data.forEach(item=>
            {
                let li=document.createElement("li");
                li.innerText=`${item.continent}: ${item.count} монети`;
                continentStatistics.appendChild(li);
            
            
        });
    }

const countryStatistics=document.getElementById("country-statistics");
countryStatistics.innerHTML="";
if(!data.country_data || data.country_data.length === 0)
{
        countryStatistics.innerHTML="<p>Няма монети по държави</p>";
}
else
{
    data.country_data.forEach(item=>{
        let li=document.createElement("li");
        li.innerText=`${item.country}: ${item.count} монети`;
        countryStatistics.appendChild(li);
    });
}

})
.catch(error=>console.error("Грешка при отварянето на статистиката:",error));
});