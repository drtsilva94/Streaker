document.getElementById("create-streak-btn").addEventListener("click", function() {
    const form = document.getElementById("streak-form");
    form.style.display = form.style.display === "none" ? "block" : "none";
});

document.getElementById("streak-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Captura os valores do formulário
    const streakName = document.getElementById("streak-name").value;
    const streakCategory = document.getElementById("streak-category").value;
    const streakPeriod = document.getElementById("streak-period").value;
    
    // Adiciona a categoria na lista de categorias
    const categoryList = document.getElementById("categories");
    const categoryItem = document.createElement("li");
    categoryItem.textContent = streakCategory;
    categoryList.appendChild(categoryItem);
    
    // Cria um novo elemento para a streak
    const streakElement = document.createElement("div");
    streakElement.classList.add("streak-item");
    streakElement.innerHTML = `<h4>${streakName}</h4><p>Categoria: ${streakCategory}</p>`;
    
    // Adiciona um calendário simplificado para o check-in
    const calendar = document.createElement("div");
    calendar.classList.add("calendar");
    for (let i = 1; i <= 30; i++) {
        const day = document.createElement("span");
        day.classList.add("calendar-day");
        day.textContent = i;
        
        // Adiciona evento de check-in que move o streak para o final do container
        day.addEventListener("click", () => {
            day.classList.toggle("checked"); // Marca/desmarca o check-in
            if (day.classList.contains("checked")) {
                moveStreakToEnd(streakElement, streakPeriod);
            }
        });
        
        calendar.appendChild(day);
    }
    streakElement.appendChild(calendar);
    
    // Adiciona a streak no container correto baseado no período selecionado
    if (streakPeriod === "manha") {
        document.getElementById("streaks-morning").appendChild(streakElement);
    } else if (streakPeriod === "tarde") {
        document.getElementById("streaks-afternoon").appendChild(streakElement);
    } else if (streakPeriod === "noite") {
        document.getElementById("streaks-evening").appendChild(streakElement);
    }
    
    // Limpa o formulário
    document.getElementById("streak-form").reset();
    document.getElementById("streak-form").style.display = "none";
});

// Função para mover o streak para o final do container
function moveStreakToEnd(streakElement, streakPeriod) {
    const containerId = {
        "manha": "streaks-morning",
        "tarde": "streaks-afternoon",
        "noite": "streaks-evening"
    }[streakPeriod];
    
    const container = document.getElementById(containerId);
    if (container && container.contains(streakElement)) {
        container.removeChild(streakElement); // Remove do local atual
        container.appendChild(streakElement); // Adiciona ao final do container
        console.log(`Streak '${streakElement.querySelector('h4').textContent}' movida para o final do container '${streakPeriod}'.`);
    } else {
        console.log("Erro: container ou streak não encontrado.");
    }
}
