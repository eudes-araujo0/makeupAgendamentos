document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const menuClose = document.getElementById("menu-close");
    const mobileMenu = document.getElementById("mobile-menu");

    // Abrir menu lateral
    menuToggle.addEventListener("click", () => {
        mobileMenu.classList.remove("translate-x-full"); // Remove a classe que esconde o menu
        mobileMenu.classList.add("translate-x-0"); // Adiciona a classe para mostrar o menu
    });

    // Fechar o menu lateral
    menuClose.addEventListener("click", () => {
        mobileMenu.classList.remove("translate-x-0"); // Remove a classe para mostrar o menu
        mobileMenu.classList.add("translate-x-full"); // Adiciona a classe para esconder o menu
    });
});