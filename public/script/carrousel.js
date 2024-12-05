let currentIndex = 0;

function moveCarousel(direction) {
  const carousel = document.getElementById('carousel');
  const images = carousel.children;
  const totalImages = images.length;

  if (direction === 'next') {
    currentIndex = (currentIndex + 1) % totalImages; // Move para a próxima imagem, volta ao início ao final
  } else {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Move para a imagem anterior
  }

  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}
console.log("Carrousel funcionando!")