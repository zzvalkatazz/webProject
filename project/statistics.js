document.addEventListener("DOMContentLoader",function()
{
fetch('statistics.php')
.then(response=>response.json())
.then(data=>{
    document.getElementById('total-coins').innerText=data.total_coins;
    document.getElementById('total-value').innerText=data.total_value.toFixed(2) + "лв";
    
    const continentStatistics=document.getElementById("continent-statisics");
    continentStatistics.innerHTML="";
    data.continent_data.forEach(item=>
    {
        let li=document.createElement("li");
        li.innerText=`${item.continent}: ${item.count} монети`;
        continentStaats.appendChild(li);
    
    
});
const countryStatistics=document.getElementById("country-statistics");
countryStatistics.innerHTML="";
data.country_data.forEach(item=>{
    let li=document.createElement("li");
    li.innerText=`${item.country}: ${item.count} монети`;
    countryStats.appendChild(li);
});
})
.catch(error=>console.error("Грешка при отварянето на статистиката"))
});