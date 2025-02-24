
function toggleMenu() {
    const menu = document.querySelector('nav ul');
    menu.classList.toggle('active');
    document.getElementById("Idmenu-icon").textContent = menu.classList.contains('active') ? 'X' : '☰';
}

let index = 0;
let slides = [];
const carousel = document.querySelector('.carousel');
const indicatorsContainer = document.querySelector('.indicators');

fetch('../json/carousel.json')
    .then(response => response.json())
    .then(data => {
        slides = data.carousel;
        renderCarousel();
        createIndicators();
        setInterval(nextSlide, 5000);
    });

function renderCarousel() {
    carousel.innerHTML = slides.map(slide => `
        <div class="carousel-item">
            <img src="${slide.image}" alt="${slide.alt}">
            <div class="carousel-text">${slide.text}</div>
            <a href="${slide.link}" class="info-button">Más info aquí</a>
        </div>
    `).join('');
}

function createIndicators() {
    indicatorsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
            index = i;
            showSlide();
        });
        indicatorsContainer.appendChild(dot);
    });
    updateIndicators();
}

function updateIndicators() {
    document.querySelectorAll('.indicator').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function showSlide() {
    carousel.style.transform = `translateX(${-index * window.innerWidth}px)`;
    updateIndicators();
}

function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide();
}

function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide();
}

window.addEventListener('resize', showSlide);


// carousel noticias 
let newsIndex = 0;
let newsData = [];

fetch('../json/noticias.json')
    .then(response => response.json())
    .then(data => {
        newsData = data.news;
        renderNews();
    });
    function renderNews() {
        const carousel = document.querySelector('.news-carousel');
        carousel.innerHTML = newsData.map(news => `
            <div class="news-item">
                <img src="${news.image}" alt="${news.title}">
                <div class="news-content">
                    <div class="news-text">${news.title}</div>
                    <a href="${news.link}" class="info-button">Más info aquí</a>
                </div>
            </div>
        `).join('');
    }

    function nextNews() {
        if (newsData.length > 3) {
            newsIndex = (newsIndex + 1) % (newsData.length - 2);
            updateNewsPosition();
        }
    }

    function prevNews() {
        if (newsData.length > 3) {
            newsIndex = (newsIndex - 1 + (newsData.length - 2)) % (newsData.length - 2);
            updateNewsPosition();
        }
    }

    function updateNewsPosition() {
        const carousel = document.querySelector('.news-carousel');
        carousel.style.transform = `translateX(${-newsIndex * (80 / 3)}vw)`;
    }
//setInterval(nextNews, 5000);

let data = {};
let paginaActual = 1;
const productosPorPagina = 3;

async function cargarDatos() {
    try {
        const response = await fetch('../json/productos.json');
        data = await response.json();
        cargarCategorias();
        mostrarProductos();
    } catch (error) {
        console.error('Error cargando los datos:', error);
    }
}

function cargarCategorias() {
    const select = document.getElementById("categoria");
    select.innerHTML = data.categorias.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join("");
}

function mostrarProductos() {
    const contenedor = document.getElementById("productos");
    const categoriaFiltro = document.getElementById("categoria").value;
    let productosFiltrados = categoriaFiltro ? data.productos.filter(p => p.categoria === categoriaFiltro) : data.productos;
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    contenedor.innerHTML = productosFiltrados.slice(inicio, fin).map(p => `
        <div class='producto'>
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
             <button onclick="verDetalles('${p.id}')">Ver más detalles</button>
        </div>`).join("");
    actualizarPaginacion(productosFiltrados.length);
}

function actualizarPaginacion(totalProductos) {
    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = "";
    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<button onclick='cambiarPagina(${i})'>${i}</button>`;
    }
}

function verDetalles(id) {
    window.location.href = `productos.html?id=${id}`;
}


function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    mostrarProductos();
}

document.getElementById("categoria").addEventListener("change", () => {
    paginaActual = 1;
    mostrarProductos();
});

cargarDatos();





document.addEventListener("DOMContentLoaded", function () {
    const ubicacionSeccion = document.getElementById("ubicacion");

    function checkScroll() {
        const rect = ubicacionSeccion.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight - 100) {
            ubicacionSeccion.classList.add("visible");
        }
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Verificar al cargar la página
});