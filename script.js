let streaks = JSON.parse(localStorage.getItem('streaks')) || [];

// Função para exibir o prompt para adicionar uma nova streak
function showAddStreakPrompt() {
    const streakName = prompt("Digite o nome da nova streak:");
    if (streakName) {
        addStreak(streakName);
    }
}

// Função para adicionar uma nova streak
function addStreak(name) {
    const newStreak = {
        name: name,
        checkDates: []
    };
    streaks.push(newStreak);
    localStorage.setItem('streaks', JSON.stringify(streaks));
    renderStreaks();
}

// Função para renderizar todas as streaks na tela
function renderStreaks() {
    const container = document.getElementById('streaks-container');
    container.innerHTML = ''; // Limpa o contêiner para renderizar novamente

    streaks.forEach((streak, index) => {
        const streakElement = document.createElement('div');
        streakElement.classList.add('streak');

        // Nome da streak com link para página de detalhes
        const title = document.createElement('h2');
        title.innerText = streak.name;
        title.onclick = () => goToStreakDetails(index);
        title.style.cursor = 'pointer';
        streakElement.appendChild(title);

        // Calendário da streak
        const calendar = document.createElement('div');
        calendar.classList.add('calendar');
        renderCalendar(calendar, streak, index);
        streakElement.appendChild(calendar);

        // Contador de check-ins
        const streakFooter = document.createElement('div');
        streakFooter.classList.add('streak-footer');
        streakFooter.innerText = `${streak.checkDates.length} dias`;
        streakElement.appendChild(streakFooter);

        container.appendChild(streakElement);
    });
}

function renderCalendar(calendar, streak, index) {
    // Limpa o calendário antes de re-renderizar
    calendar.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Cria células vazias no início do mês
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day');
        emptyCell.style.visibility = 'hidden'; // Oculta células vazias
        calendar.appendChild(emptyCell);
    }

    // Preenche os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-day');
        cell.innerText = day;

        const date = new Date(currentYear, currentMonth, day).toDateString();

        // Verifica se o dia tem check-in
        if (streak.checkDates.includes(date)) {
            cell.classList.add('checked');
        }

        // Adiciona evento de clique para registrar o check-in
        cell.onclick = () => {
            if (!streak.checkDates.includes(date)) {
                streak.checkDates.push(date);
                localStorage.setItem('streaks', JSON.stringify(streaks));
                renderCalendar(calendar, streak, index); // Re-renderiza o calendário para atualizar a visualização
            } else {
                alert("Check-in já registrado para este dia!");
            }
        };

        calendar.appendChild(cell);
    }
}



// Função para ir para a página de detalhes da streak
function goToStreakDetails(index) {
    localStorage.setItem('selectedStreakIndex', index);
    window.location.href = 'streak.html';
}

// Inicializa a exibição das streaks
renderStreaks();
