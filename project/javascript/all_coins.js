document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("coins-gallery");
    const searchInput = document.getElementById("search");
    const filterContinent = document.getElementById("filter-continent");
    const sortSelect = document.getElementById("sort");

    function fetchAndShowCoins() {
        const searchQuery = searchInput.value.trim();
        const selectedContinent = filterContinent.value;
        const selectedSort = sortSelect.value;

        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedContinent) params.append("continent", selectedContinent);
        if (selectedSort) params.append("sort", selectedSort);

        fetch("../php/all_coins.php?" + params.toString())
            .then(response => response.json())
            .then(data => {
                console.log("📥 Получени данни от сървъра:", data);
                gallery.innerHTML = "";
                if (!data.coins || data.coins.length === 0) {
                    gallery.innerHTML = "<p>Няма намерени монети.</p>";
                    return;
                }

                data.coins.forEach(coin => {
                    let div = document.createElement("div");
                    div.className = "coin-item";
                    div.innerHTML = `
                        <div class="coin-container">
                            <div class="coin-images">
                                <img src ="../uploads/${coin.front_image}" alt="${coin.name}" class="coin-front">
                                <button class="like-button" data-coin-id="${coin.id}" data-image-type="front">
                                    👍 <span class="like-count">${coin.likes_front || 0}</span>
                                </button>
                                <img src ="../uploads/${coin.back_image}" alt="${coin.name}" class="coin-back">
                                <button class="like-button" data-coin-id="${coin.id}" data-image-type="back">
                                    👍 <span class="like-count">${coin.likes_back || 0}</span>
                                </button>
                            </div>
                            <p><strong>${coin.name}</strong> (${coin.year})</p>
                            <p>${coin.value}, ${coin.country}</p>
                        </div>
                    `;
                    gallery.appendChild(div);
                });

                addLikeEventListeners(); // Добавяне на обработчици за лайкове
            })
            .catch(error => console.error("❌ Грешка при зареждането на колекцията", error));
    }

    function addLikeEventListeners() {
        document.querySelectorAll(".like-button").forEach(button => {
            button.addEventListener("click", function () {
                let coinId = button.getAttribute("data-coin-id");
                let imageType = button.getAttribute("data-image-type");

                fetch("../php/like.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `coin_id=${coinId}&image_type=${imageType}`
                })
                .then(response => response.json())
                .then(data => {
                    console.log("📤 Server response:", data); // ✅ Проверка на отговора
                    if (data.success) {
                        // Обновяване на лайк броя веднага за този бутон
                        let likeCountSpan = button.querySelector(".like-count");
                        if (likeCountSpan) {
                            likeCountSpan.textContent = data.likes;
                        } else {
                            console.error("❌ .like-count не е намерен в бутона!", button);
                        }
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error("❌ Грешка при лайкване:", error));
            });
        });
    }

    // Функция за обновяване на лайковете, ако е необходимо
    function updateLikesDisplay() {
        fetch("../php/like.php")
        .then(response => response.json())
        .then(data => {
            console.log("🔄 Обновяване на лайковете:", data);
            data.forEach(like => {
                let buttons = document.querySelectorAll(`.like-button[data-coin-id='${like.coin_id}'][data-image-type='${like.image_type}']`);
                buttons.forEach(button => {
                    let count = button.querySelector(".like-count");
                    if (count) {
                        count.textContent = like.likes;
                    }
                });
            });
        })
        .catch(error => console.error("❌ Грешка при зареждане на лайковете:", error));
    }

    searchInput.addEventListener("input", fetchAndShowCoins);
    filterContinent.addEventListener("change", fetchAndShowCoins);
    sortSelect.addEventListener("change", fetchAndShowCoins);

    // Зареждаме монетите и обновяваме лайковете
    fetchAndShowCoins();
    updateLikesDisplay();
});
