
// Elementos do DOM
const monthYearLabel = document.getElementById("month-year");
const carousel = document.getElementById("carousel");
const prevDateButton = document.getElementById("prev-date");
const nextDateButton = document.getElementById("next-date");
const timeSlotsContainer = document.getElementById("time-slots"); // Contêiner de horários

// Horários padrão para todos os dias
const defaultTimeSlots = ["08:00", "14:00", "18:00"];

// Data inicial
let currentDate = new Date(); // Hoje
let visibleStartDate = new Date(currentDate); // Ponto inicial do carrossel
let visibleEndDate = new Date(visibleStartDate);
visibleEndDate.setDate(visibleEndDate.getDate() + 6); // Mostra 7 dias por vez

// Função para formatar o mês e ano
function getMonthYearString(date) {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Função para gerar o carrossel de datas
let currentIndex = 0;

function generateCarousel(startDate) {
    const visibleDays = window.innerWidth <= 640 ? 4 : 7; // 4 no mobile, 7 no desktop
    const tempDate = new Date(startDate);
    carousel.innerHTML = ''; // Limpa o carrossel

    for (let i = 0; i < visibleDays; i++) {
        const dayButton = document.createElement("button");
        dayButton.className =
            "date-btn flex flex-col items-center bg-gray-100 border border-gray-300 rounded-md p-2 w-20 hover:bg-blue-100 hover:border-blue-400 active:bg-blue-500 active:text-white";
        dayButton.dataset.date = tempDate.toISOString().split("T")[0];

        // Adiciona o dia da semana e número do dia
        const dayOfWeek = tempDate.toLocaleDateString("pt-BR", { weekday: "short" });
        const dayOfMonth = tempDate.getDate();
        dayButton.innerHTML = `
            <span class="text-sm text-gray-500">${dayOfWeek}</span>
            <span class="text-lg font-bold text-gray-800">${dayOfMonth}</span>
        `;

        // Destaque automático para a data atual
        if (dayButton.dataset.date === currentDate.toISOString().split("T")[0]) {
            dayButton.classList.add("selected", "bg-blue-500", "text-white");
            // Exibe os horários automaticamente para a data atual
            displayTimeSlots(dayButton.dataset.date);
        }

        // Evento ao clicar no botão
        dayButton.addEventListener("click", () => {
            // Remove seleção anterior
            document.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected", "bg-blue-500", "text-white"));
            // Adiciona seleção ao botão clicado
            dayButton.classList.add("selected", "bg-blue-500", "text-white");

            // Exibir horários disponíveis para a data
            const selectedDate = dayButton.dataset.date;
            displayTimeSlots(selectedDate); // Integre aqui a função de horários
        });

        carousel.appendChild(dayButton);
        tempDate.setDate(tempDate.getDate() + 1); // Próximo dia
    }

    // Atualiza o mês e ano
    monthYearLabel.textContent = getMonthYearString(startDate);
}

// Função para exibir os horários disponíveis para a data selecionada
function displayTimeSlots(selectedDate) {
    timeSlotsContainer.innerHTML = ""; // Limpa os horários anteriores

    // Exibe os horários padrão (todos os dias terão os mesmos horários)
    defaultTimeSlots.forEach((time) => {
        const timeButton = document.createElement("button");
        timeButton.className =
            "time-slot-btn bg-gray-100 border border-gray-300 rounded-md px-4 py-2 hover:bg-blue-100 hover:border-blue-400 active:bg-blue-500 active:text-white";
        timeButton.textContent = time;

        // Evento de clique para selecionar o horário
        timeButton.addEventListener("click", () => {
            document.querySelectorAll(".time-slot-btn.selected").forEach((el) =>
                el.classList.remove("selected", "bg-blue-500", "text-white")
            );

            // Marca o horário como selecionado
            timeButton.classList.add("selected", "bg-blue-500", "text-white");
            console.log(`Horário selecionado: ${time}`);
        });

        timeSlotsContainer.appendChild(timeButton);
    });
}

// Função para navegar no carrossel
function changeVisibleDates(direction) {
    visibleStartDate.setDate(visibleStartDate.getDate() + direction * 7);
    visibleEndDate.setDate(visibleEndDate.getDate() + direction * 7);
    generateCarousel(visibleStartDate);
}

// Inicialização
generateCarousel(visibleStartDate);

// Eventos de navegação
prevDateButton.addEventListener("click", () => changeVisibleDates(-1));
nextDateButton.addEventListener("click", () => changeVisibleDates(1));