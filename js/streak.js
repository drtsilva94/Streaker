let streaks = JSON.parse(localStorage.getItem('streaks'));
const streakIndex = localStorage.getItem('selectedStreakIndex');
let streak = streaks[streakIndex];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDateToDelete = null; // Variável para armazenar a data selecionada para exclusão

// Exibe o nome da streak e o total de check-ins
function displayStreakDetails() {
    document.getElementById('streak-name').innerText = streak.name;
    showTotalCheckins('all'); // Exibe o total geral de check-ins por padrão
    renderCalendar();
}

// Função para exibir o total de check-ins com base na opção selecionada
function showTotalCheckins(option) {
    let totalCheckins = 0;

    if (option === 'all') {
        // Conta todos os check-ins
        totalCheckins = streak.checkDates.length;
    } else if (option === 'monthly') {
        // Conta apenas os check-ins do mês atual
        totalCheckins = streak.checkDates.filter(date => {
            const checkinDate = new Date(date);
            return (
                checkinDate.getMonth() === currentMonth &&
                checkinDate.getFullYear() === currentYear
            );
        }).length;
    }

    document.getElementById('checkin-total').innerText = `${totalCheckins} dias`;
}

// Edita o nome da streak
function editStreak() {
    const newName = prompt("Digite o novo nome da streak:", streak.name);
    if (newName) {
        streak.name = newName;
        localStorage.setItem('streaks', JSON.stringify(streaks));
        displayStreakDetails();
    }
}

// Função para confirmar e excluir a streak
function confirmDeleteStreak() {
    streaks.splice(streakIndex, 1);
    localStorage.setItem('streaks', JSON.stringify(streaks));
    window.location.href = 'index.html';
}

// Renderiza o calendário para o mês atual
function renderCalendar() {
    const calendarBody = document.getElementById("calendar-body");
    const monthYearDisplay = document.getElementById("month-year");

    calendarBody.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYearDisplay.textContent = `${new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long' })} ${currentYear}`;

    let date = 1;

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.classList.add("empty");
            } else if (date > daysInMonth) {
                break;
            } else {
                cell.textContent = date;

                const cellDate = new Date(currentYear, currentMonth, date).toDateString();

                if (streak.checkDates.includes(cellDate)) {
                    cell.classList.add("checked");
                }

                // Adiciona evento de clique para registrar ou remover o check-in
                cell.onclick = () => {
                    if (streak.checkDates.includes(cellDate)) {
                        // Se o dia já tem check-in, abre o modal de confirmação
                        selectedDateToDelete = cellDate;
                        openModal();
                    } else {
                        // Se o dia não tem check-in, adiciona o check-in
                        streak.checkDates.push(cellDate);
                        localStorage.setItem('streaks', JSON.stringify(streaks));
                        renderCalendar(); // Re-renderiza o calendário para atualizar a visualização
                        displayStreakDetails();
                    }
                };

                date++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}

function openDeleteStreakConfirmation() {
    document.getElementById("confirmStreakDeleteModal").style.display = "flex"; // Mostra o modal de confirmação de exclusão da streak
}

function closeStreakModal() {
    document.getElementById("confirmStreakDeleteModal").style.display = "none"; // Fecha o modal de confirmação de exclusão da streak
}

// Abre o modal de confirmação de exclusão de check-in
function openModal() {
    document.getElementById("confirmModal").style.display = "block";
}

// Fecha o modal de confirmação de exclusão de check-in
function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
    selectedDateToDelete = null; // Reseta a data selecionada para exclusão
}

// Confirma a exclusão do check-in
function confirmDeleteCheckin() {
    if (selectedDateToDelete) {
        streak.checkDates = streak.checkDates.filter(d => d !== selectedDateToDelete);
        localStorage.setItem('streaks', JSON.stringify(streaks));
        renderCalendar(); // Re-renderiza o calendário para atualizar a visualização
        displayStreakDetails();
        closeModal(); // Fecha o modal após a exclusão
    }
}

// Muda para o mês anterior
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
    showTotalCheckins('monthly'); // Atualiza a contagem para o mês atual ao mudar de mês
}

// Muda para o próximo mês
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
    showTotalCheckins('monthly'); // Atualiza a contagem para o mês atual ao mudar de mês
}

displayStreakDetails();
