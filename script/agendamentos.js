// Elementos do DOM
const monthYearLabel = document.getElementById("month-year");
const carousel = document.getElementById("carousel");
const prevDateButton = document.getElementById("prev-date");
const nextDateButton = document.getElementById("next-date");
const timeSlotsContainer = document.getElementById("time-slots");
const modal = document.getElementById("modal");
const confirmForm = document.getElementById("confirm-form");
const cancelModalButton = document.getElementById("cancel-modal");
const makeupSelection = document.getElementById("makeup-selection");
const makeupPrice = document.getElementById("makeup-price");

// Horários padrão para todos os dias
const defaultTimeSlots = ["08:00", "14:00", "18:00"];

// Objeto para rastrear status dos horários por dia
let timeSlotsStatus = JSON.parse(localStorage.getItem("timeSlotsStatus")) || {};

// Variáveis para armazenar dados do horário selecionado
let selectedDate = null;
let selectedTime = null;
let selectedMakeup = { name: '', price: 0 };

// Data inicial
let currentDate = new Date();
let visibleStartDate = new Date(currentDate);
let visibleEndDate = new Date(visibleStartDate);
visibleEndDate.setDate(visibleEndDate.getDate() + 6);

// Função para formatar o mês e ano
function getMonthYearString(date) {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Gerar o carrossel de datas
function generateCarousel(startDate) {
    const visibleDays = window.innerWidth <= 640 ? 4 : 7;
    const tempDate = new Date(startDate);
    carousel.innerHTML = '';

    for (let i = 0; i < visibleDays; i++) {
        const dayDate = tempDate.toISOString().split("T")[0];
        const dayButton = document.createElement("button");
        dayButton.className = "date-btn relative flex flex-col items-center border border-gray-300 rounded-md p-2 w-20 hover:bg-green-300 hover:border-green-400 active:bg-green-500 active:text-white";
        dayButton.dataset.date = dayDate;

        if (!timeSlotsStatus[dayDate]) {
            timeSlotsStatus[dayDate] = [...defaultTimeSlots];
        }

        const dayOfWeek = tempDate.toLocaleDateString("pt-BR", { weekday: "short" });
        const dayOfMonth = tempDate.getDate();
        dayButton.innerHTML = ` 
            <span class="text-sm text-gray-500">${dayOfWeek}</span>
            <span class="text-lg font-bold text-gray-800">${dayOfMonth}</span>
        `;

        // Verifica se todos os horários estão ocupados
        const slots = timeSlotsStatus[dayDate] || [];
        const allSlotsOccupied = defaultTimeSlots.every((time) => !slots.includes(time));

        if (allSlotsOccupied) {
            dayButton.classList.add("cursor-not-allowed", "bg-red-500", "border-red-500", "hover:bg-red-500", "active:bg-red-600");
            const unavailableBar = document.createElement("div");
            unavailableBar.classList.add("hidden"); // Barra vermelha abaixo
            dayButton.appendChild(unavailableBar);
            dayButton.setAttribute("disabled", "true");
        }

        if (dayDate === currentDate.toISOString().split("T")[0]) {
            dayButton.classList.add("selected", "bg-green-500", "text-white");
            const checkMark = document.createElement("img");
            checkMark.src = "https://cdn-icons-png.flaticon.com/512/5290/5290058.png";
            checkMark.alt = "Check mark";
            checkMark.className = "absolute top-[-4px] right-[-4px] w-5 h-5 z-10 check-mark";
            dayButton.appendChild(checkMark);

            selectedDate = dayDate;
            displayTimeSlots(selectedDate);
        }

        dayButton.addEventListener("click", (e) => {
            if (!e.currentTarget.disabled) {
                // Remover check-mark de todas as datas
                document.querySelectorAll(".date-btn").forEach((btn) => {
                    btn.classList.remove("selected", "bg-green-500", "text-white");
                    const existingCheckMark = btn.querySelector(".check-mark");
                    if (existingCheckMark) existingCheckMark.remove();
                });
        
                // Adicionar check-mark e selecionar a data
                e.currentTarget.classList.add("selected", "bg-green-500", "text-white");
                const checkMark = document.createElement("img");
                checkMark.src = "https://cdn-icons-png.flaticon.com/512/5290/5290058.png";
                checkMark.alt = "Check mark";
                checkMark.className = "absolute top-[-4px] right-[-4px] w-5 h-5 z-10 check-mark";
                e.currentTarget.appendChild(checkMark);
        
                // Atualizar a data selecionada
                selectedDate = e.currentTarget.dataset.date;
                displayTimeSlots(selectedDate);
            } else {
                e.currentTarget.classList.add("bg-red-500", "cursor-not-allowed");
                e.currentTarget.classList.add("hover:bg-red-500", "active:bg-red-600");
            }
        });
        

        carousel.appendChild(dayButton);
        tempDate.setDate(tempDate.getDate() + 1);
    }

    monthYearLabel.textContent = getMonthYearString(startDate);
}

// Exibir os horários disponíveis de uma data
function displayTimeSlots(selectedDate) {
    timeSlotsContainer.innerHTML = "";

    const slots = timeSlotsStatus[selectedDate] || [];

    defaultTimeSlots.forEach((time) => {
        const timeButton = document.createElement("button");
        timeButton.className = "time-slot-btn border border-gray-300 rounded-md px-4 py-2";

        if (!slots.includes(time)) {
            timeButton.classList.add("bg-gray-300", "text-gray-500", "cursor-not-allowed");
        } else {
            timeButton.classList.add(
                "hover:bg-blue-100",
                "hover:border-blue-400",
                "active:bg-blue-500",
                "active:text-white"
            );

            timeButton.addEventListener("click", () => {
                selectedTime = time;
                document.querySelectorAll(".time-slot-btn").forEach((btn) => {
                    btn.classList.remove("selected", "bg-blue-500", "text-white");
                });
                timeButton.classList.add("selected", "bg-blue-500", "text-white");
            });
        }

        timeButton.textContent = time;
        timeSlotsContainer.appendChild(timeButton);
    });

    // Verifica se todos os slots do dia estão preenchidos e marca a data como indisponível
    const allSlotsOccupied = defaultTimeSlots.every((time) => !slots.includes(time));
    if (allSlotsOccupied) {
        const dayButton = document.querySelector(`button[data-date="${selectedDate}"]`);
        if (dayButton) {
            dayButton.classList.add("cursor-not-allowed", "bg-red-500", "border-red-500", "hover:bg-red-500", "active:bg-red-600");
            const unavailableBar = document.createElement("div");
            unavailableBar.classList.add("w-full", "h-1", "rounded-lg", "bg-red-800", "mt-2"); // Barra vermelha abaixo
            dayButton.appendChild(unavailableBar);
            dayButton.setAttribute("disabled", "true");
        }
    }
}

// Atualizar maquiagem selecionada
function updateMakeupSelection() {
    const selectedMakeupRadio = document.querySelector('input[name="makeup"]:checked');
    const makeupChosenLabel = document.getElementById("makeup-chosen-label");

    if (selectedMakeupRadio) {
        let makeupName = selectedMakeupRadio.nextElementSibling.textContent.trim();
        let makeupPriceValue = 0;

        if (selectedMakeupRadio.id === "makeNoivado") {
            makeupPriceValue = 500;
        } else if (selectedMakeupRadio.id === "makeFestas") {
            makeupPriceValue = 150;
        } else if (selectedMakeupRadio.id === "makeCasual") {
            makeupPriceValue = 80;
        }

        selectedMakeup = { name: makeupName, price: makeupPriceValue };

        document.getElementById("makeup-chosen").value = makeupName;
        makeupChosenLabel.textContent = "";
    } else {
        document.getElementById("makeup-chosen").value = "";
        makeupChosenLabel.textContent = "Nenhuma maquiagem escolhida";
    }
}

// Adicionar eventos aos inputs de rádio
document.querySelectorAll('input[name="makeup"]').forEach((radio) => {
    radio.addEventListener("change", updateMakeupSelection);
});

// Função para resetar os horários
function resetTimeSlots() {
    timeSlotsStatus = {};

    Object.keys(timeSlotsStatus).forEach((date) => {
        timeSlotsStatus[date] = [...defaultTimeSlots];
    });

    localStorage.setItem("timeSlotsStatus", JSON.stringify(timeSlotsStatus));
    generateCarousel(visibleStartDate);
}

document.getElementById("reset-timeslots").addEventListener("click", () => {
    if (confirm("Você tem certeza que deseja resetar todos os horários agendados?")) {
        resetTimeSlots();
    }
});

// Função para mudar as datas visíveis no carrossel
function changeVisibleDates(direction) {
    visibleStartDate.setDate(visibleStartDate.getDate() + direction * 7);
    visibleEndDate.setDate(visibleEndDate.getDate() + direction * 7);
    generateCarousel(visibleStartDate);
}

prevDateButton.addEventListener("click", () => changeVisibleDates(-1));
nextDateButton.addEventListener("click", () => changeVisibleDates(1));

// Mostrar o modal
function showModal() {
    modal.classList.remove("hidden");

    const makeupChosenLabel = document.getElementById("makeup-chosen");
    const selectedMakeupRadio = document.querySelector('input[name="makeup"]:checked');

    if (selectedMakeupRadio) {
        makeupChosenLabel.textContent = selectedMakeupRadio.nextElementSibling.textContent.trim();
    } else {
        makeupChosenLabel.textContent = "Nenhuma maquiagem escolhida";
    }

    const makeupPriceElement = document.getElementById("makeup-prices");
    if (selectedMakeupRadio) {
        const price = parseFloat(selectedMakeupRadio.dataset.price || 0);
        makeupPriceElement.value = `R$ ${price.toFixed(2)}`;
    } else {
        makeupPriceElement.value = "R$ 0,00";
    }
}

document.getElementById("confirmarAgendamento").addEventListener("click", () => {
    if (selectedDate && selectedTime) {
        showModal();
    } else {
        alert("Por favor, selecione uma data e um horário antes de confirmar o agendamento.");
    }
});

// Fechar o modal
function closeModal() {
    modal.classList.add("hidden");
}

cancelModalButton.addEventListener("click", closeModal);

confirmForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (selectedDate && selectedTime) {
        timeSlotsStatus[selectedDate] = timeSlotsStatus[selectedDate].filter((slot) => slot !== selectedTime);
        localStorage.setItem("timeSlotsStatus", JSON.stringify(timeSlotsStatus));
        displayTimeSlots(selectedDate);
    }

    // Adicionar os valores ao localStorage
    const name = document.getElementById("name").value;
    const makeup = document.getElementById("makeup-chosen").value;
    const price = document.getElementById("makeup-prices").value;
    const payment = document.getElementById("payment").value;
    const obs = document.getElementById("notes").value;

    const appointment = {
        name,
        date: selectedDate,
        time: selectedTime,
        makeup,
        price,
        payment,
        obs,
    };

    // Salvar os dados no localStorage
    localStorage.setItem("currentAppointment", JSON.stringify(appointment));

    // Redirecionar para a página de confirmação
    window.location.href = "/pages/agendamentoSucess.html"; // Substitua pelo caminho correto da página
});
    
    // Inicializar os componentes ao carregar a página
    document.addEventListener("DOMContentLoaded", () => {
        // Gerar o carrossel inicial
        generateCarousel(visibleStartDate);
    
        // Atualizar seleção de maquiagem se necessário
        updateMakeupSelection();
    
        // Exibir horários do dia inicial, se aplicável
        if (selectedDate) {
            displayTimeSlots(selectedDate);
        }
    });
    
