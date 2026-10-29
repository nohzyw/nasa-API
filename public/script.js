const btnBuscar = document.getElementById('btnBuscar');
const carouselContainer = document.getElementById('carouselContainer');
const carouselTrack = document.getElementById('carouselTrack');
const statusMessage = document.getElementById('statusMessage');
const btnAnterior = document.getElementById('btnAnterior');
const btnProximo = document.getElementById('btnProximo');

let imagensFiltradas = [];
let currentIndex = 0;

btnBuscar.addEventListener('click', async () => {
    const astroAlvo = document.getElementById('inputAstro').value.trim();
    if (!astroAlvo) {
        alert('Por favor, digite o nome de um astro para pesquisar.');
        return;
    }

    statusMessage.textContent = 'Buscando dados na NASA...';
    carouselContainer.style.display = 'none';
    carouselTrack.innerHTML = '';

    try {
        const res = await fetch('/api/buscar?astro=' + encodeURIComponent(astroAlvo));
        imagensFiltradas = await res.json();

        if (imagensFiltradas.length > 0) {
            statusMessage.textContent = `Sucesso! Encontradas ${imagensFiltradas.length} imagens para "${astroAlvo}".`;
            gerarSlides();
        } else {
            statusMessage.textContent = `Nenhuma imagem sem copyright encontrada para "${astroAlvo}" neste período. Tente pesquisar outro astro (em inglês, ex: nebula, galaxy, moon, sun, comet, saturn).`;
        }
    } catch (error) {
        statusMessage.textContent = 'Erro ao processar dados.';
    }
});

function gerarSlides() {
    currentIndex = 0;
    carouselTrack.style.transform = 'translateX(0%)';

    imagensFiltradas.forEach(item => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        slide.innerHTML = `
            <img src="${item.url}" alt="${item.alt || item.titulo}" loading="lazy">
            <div class="carousel-caption">
                <h3>${item.titulo}</h3>
                <p>Data de Registro: ${item.data}</p>
            </div>
        `;
        carouselTrack.appendChild(slide);
    });

    carouselContainer.style.display = 'block';
}

function atualizarPosicao() {
    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
}

btnProximo.addEventListener('click', () => {
    if (currentIndex < imagensFiltradas.length - 1) {
        currentIndex++;
        atualizarPosicao();
    }
});

btnAnterior.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        atualizarPosicao();
    }
});
