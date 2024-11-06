// Carrega streaks do localStorage ou inicializa com um array vazio
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
        checkDates: [] // Array para armazenar as datas de check-ins
    };
    streaks.push(newStreak);
    saveStreaks(); // Salva as streaks no localStorage
    renderStreaks(); // Atualiza a exibição das streaks
}

// Função para renderizar todas as streaks na tela
function renderStreaks() {
    const container = document.getElementById('streaks-container');
    container.innerHTML = ''; // Limpa o contêiner antes de re-renderizar

    streaks.forEach((streak, index) => {
        const streakElement = document.createElement('div');
        streakElement.classList.add('streak');

        // Nome da streak com link para página de detalhes
        const title = document.createElement('h2');
        title.innerText = streak.name;
        title.onclick = () => goToStreakDetails(index); // Função para redirecionar para detalhes
        title.style.cursor = 'pointer';
        streakElement.appendChild(title);

        // Calendário da streak
        const calendar = document.createElement('div');
        calendar.classList.add('calendar');
        renderCalendar(calendar, streak, index); // Função para renderizar o calendário
        streakElement.appendChild(calendar);

        // Contador de check-ins
        const streakFooter = document.createElement('div');
        streakFooter.classList.add('streak-footer');
        streakFooter.innerText = `${streak.checkDates.length} dias`; // Exibe o total de check-ins
        streakElement.appendChild(streakFooter);

        container.appendChild(streakElement);
    });
}

// Função para renderizar o calendário de uma streak específica
function renderCalendar(calendar, streak, index) {
    calendar.innerHTML = ''; // Limpa o calendário antes de re-renderizar

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Células vazias no início do mês
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
            cell.classList.add('checked'); // Marca o dia com check-in
        }

        // Evento de clique para registrar o check-in
        cell.onclick = () => handleCheckIn(date, streak, calendar, index);

        calendar.appendChild(cell);
    }
}

// Função para manipular o check-in de um dia específico
function handleCheckIn(date, streak, calendar, index) {
    if (!streak.checkDates.includes(date)) {
        streak.checkDates.push(date); // Adiciona check-in se não houver ainda
        saveStreaks(); // Salva mudanças no localStorage
        renderCalendar(calendar, streak, index); // Re-renderiza o calendário
    } else {
        alert("Check-in já registrado para este dia!"); // Informa ao usuário
    }
}

// Função para ir para a página de detalhes da streak
function goToStreakDetails(index) {
    localStorage.setItem('selectedStreakIndex', index); // Salva índice da streak selecionada
    window.location.href = 'streak.html'; // Redireciona para streak.html
}

// Função para salvar as streaks no localStorage
function saveStreaks() {
    localStorage.setItem('streaks', JSON.stringify(streaks));
}

// Inicializa a exibição das streaks
renderStreaks();
