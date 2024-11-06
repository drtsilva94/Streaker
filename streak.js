let streaks = JSON.parse(localStorage.getItem('streaks'));
const streakIndex = localStorage.getItem('selectedStreakIndex');
let streak = streaks[streakIndex];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Exibe o nome da streak e o total de check-ins
function displayStreakDetails() {
    document.getElementById('streak-name').innerText = streak.name;
    document.getElementById('checkin-total').innerText = `${streak.checkDates.length} dias`;
    renderCalendar();
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

// Exclui a streak
function deleteStreak() {
    streaks.splice(streakIndex, 1);
    localStorage.setItem('streaks', JSON.stringify(streaks));
    window.location.href = 'index.html';
}

function renderCalendar() {
    const calendarBody = document.getElementById("calendar-body");
    const monthYearDisplay = document.getElementById("month-year");

    // Limpa o conteúdo do calendário antes de re-renderizar
    calendarBody.innerHTML = '';

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

                // Adiciona evento de clique para registrar o check-in
                cell.onclick = () => {
                    if (!streak.checkDates.includes(cellDate)) {
                        streak.checkDates.push(cellDate);
                        localStorage.setItem('streaks', JSON.stringify(streaks));
                        renderCalendar(); // Re-renderiza o calendário para atualizar a visualização
                        displayStreakDetails();
                    } else {
                        alert("Check-in já registrado para este dia!");
                    }
                };

                date++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
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
}

// Muda para o próximo mês
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

displayStreakDetails();
