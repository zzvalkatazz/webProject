document.addEventListener("DOMContentLoaded",function()
{
    const gallery= document.getElementById("coins-gallery");

    function fetchAndShowCoins()
    {
        fetch("my_collection.php")
        .then(response=>response.json())
        .then(data=>
        {
            console.log("Получени данни от сървър:",data)
            gallery.innerHTML="";
            if(!data.coins || data.coins.length===0)
            {
                gallery.innerHTML="<p>Няма намерени монети.</p>";
                return;
            }
            data.coins.forEach(coin => {
                let div= document.createElement("div");
                div.className="coin-item";
                div.innerHTML=`
                <div class="coin-container">
                <div class="coin-images">
                <img src ="uploads/${coin.front_image}" alt="${coin.name}" class="coin-front">
                 <img src ="uploads/${coin.back_image}" alt="${coin.name}" class="coin-back">
                 </div>
                 <p><strong>${coin.name}</strong> (${coin.year})</p>
                 <p>${coin.value}, ${coin.country}</p>
                 <button onclick="showDetails(${coin.id})"> Детайли за монетата</button>
                 </div>
                `;
                gallery.appendChild(div);
            });
        })
        .catch(error=>console.error("Грешка при зареждането на колекцията",error));
    }
    fetchAndShowCoins();
});