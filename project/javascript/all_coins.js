document.addEventListener("DOMContentLoaded",function()
{
    const gallery= document.getElementById("coins-gallery");
    const searchInput=document.getElementById("search");
    const filterContinent= document.getElementById("filter-continent");
    const sortSelect=document.getElementById("sort");

    const modal=document.getElementById("coinModal");

    const modalTitle=modal.querySelector(".modal-title");
    const modalYear=modal.querySelector(".modal-year");
    const modalCountry=modal.querySelector(".modal-country");
    const modalValue=modal.querySelector(".modal-value");
    const modalContinent=modal.querySelector(".modal-continent");
    const modalCollection=modal.querySelector(".modal-collection");
    const modalOwner=modal.querySelector(".modal-owner");
    const modalFront=modal.querySelector(".modal-front");
    const modalBack=modal.querySelector(".modal-back");
    const modalClose=modal.querySelector(".close");

    function fetchAndShowCoins()
    {
        const searchQuery= searchInput.value.trim();
        const selectedContinent = filterContinent.value;
        const selectedSort = sortSelect.value;

        const params= new URLSearchParams();
        if(searchQuery) params.append("search",searchQuery);
        if(selectedContinent) params.append("continent", selectedContinent);
        if(sortSelect.value) params.append("sort",sortSelect.value);
        fetch("../php/all_coins.php?"  + params.toString())
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
                <img src ="../uploads/${coin.front_image}" alt="${coin.name}" class="coin-front">
                 <img src ="../uploads/${coin.back_image}" alt="${coin.name}" class="coin-back">
                 </div>
                 <p><strong>${coin.name}</strong> (${coin.year})</p>
                 <p>${coin.value}, ${coin.country}</p>
                 <p>Колекция ${coin.collection_name || "Неизвестна"}</p>
                 <p> Качено от :${coin.owner}</p>
                 <button onclick="showDetails('${encodeURIComponent(coin.name)}','${coin.year}','${encodeURIComponent(coin.country)}','${coin.value}','${encodeURIComponent(coin.continent)}','${encodeURIComponent(coin.collection_name)}','${encodeURIComponent(coin.owner)}','${coin.front_image}','${coin.back_image}')"> Детайли за монетата</button>
                 </div>
                `;
                gallery.appendChild(div);
            });
        })
        .catch(error=>console.error("Грешка при зареждането на колекцията",error));
    }
    window.showDetails=function(name,year,country,value,continent,collection,owner,frontImage,backImage)
    {
        modal.style.display="block";
        modalTitle.textContent=decodeURIComponent(name);
        modalYear.textContent=`Година:${decodeURIComponent(year)}`;
        modalCountry.textContent=`Държава: ${decodeURIComponent(country)}`;
        modalValue.textContent=`Стойност:${value} лв`;
        modalContinent.textContent=`Континент:${decodeURIComponent(continent)}`;
        modalCollection.textContent=`Колекция:${decodeURIComponent(collection)}`;
        modalOwner.textContent=`Собственик: ${decodeURIComponent(owner)}`;
        modalFront.src=`../uploads/${frontImage}`;
        modalBack.src=`../uploads/${backImage}`;
       
    };

    window.closeModal=function()
    {
        modal.style.display="none";
    };

    modalClose.addEventListener("click",closeModal);
    searchInput.addEventListener("input",fetchAndShowCoins);
    filterContinent.addEventListener("change",fetchAndShowCoins);
    sortSelect.addEventListener("change",fetchAndShowCoins);
    fetchAndShowCoins();

     // Функция за лайкване на монета
    function likeCoin(coinId, button) {
        fetch("../php/like.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `coin_id=${coinId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Обновяваме броя на "like"-овете в интерфейса
                const likeCount = button.querySelector(".like-count");
                likeCount.textContent = data.likes; // новият брой на like-овете
            } else {
                alert(data.message); // ако има грешка
            }
        })
        .catch(error => console.error("Грешка при изпращане на like:", error));
    }
});
