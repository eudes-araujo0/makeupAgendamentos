const appointmentData = JSON.parse(localStorage.getItem("currentAppointment"));

if (appointmentData) {
    // Preencher os elementos da página com os dados
    document.getElementById("confirmed-name").textContent = appointmentData.name || "N/A";
    document.getElementById("date-confirmation").textContent = appointmentData.date || "N/A";
    document.getElementById("time-confirmation").textContent = appointmentData.time || "N/A";
    document.getElementById("makeup-confirmation").textContent = appointmentData.makeup || "N/A";
    document.getElementById("price-confirmation").textContent = appointmentData.price || "N/A";
    document.getElementById("payment-confirmation").textContent = appointmentData.payment || "N/A";
    document.getElementById("confirmed-notes").textContent = appointmentData.value  || "N/A";

    // Opcional: Limpar o localStorage após exibir os dados
    localStorage.removeItem("currentAppointment");
}