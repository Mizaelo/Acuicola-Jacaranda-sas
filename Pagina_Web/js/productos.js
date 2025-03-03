document.addEventListener("DOMContentLoaded", function () {
    fetch("../json/productos.json")
        .then(response => response.json())
        .then(data => {
            mostrarCategorias(data.categorias);
            mostrarProductos(data.productos);
        });
});

let categoriasSeleccionadas = new Set();
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito[index].cantidad += 1; // Aumentamos la cantidad si ya está en el carrito
    } else {
        carrito.push({ id: id, cantidad: 1 }); // Si no está, lo agregamos con cantidad 1
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    fetch("../json/productos.json")
        .then(response => response.json())
        .then(data => {
            const carritoLista = document.getElementById("carrito-lista");
            const totalPrecio = document.getElementById("total-precio");
            const contadorCarrito = document.getElementById("contador-carrito");
            carritoLista.innerHTML = "";
            let total = 0;
            let cantidadTotal = 0;

            if (carrito.length === 0) {
                carritoLista.innerHTML = "<p>El carrito está vacío.</p>";
                contadorCarrito.textContent = cantidadTotal;
                return;
            }

            carrito.forEach(item => {
            
                const producto = data.productos.find(p => p.id === item.id);
                const precioOferta = producto.precio - (producto.precio * producto.descuento / 100);
                total += producto.oferta_activa ? precioOferta * item.cantidad : producto.precio * item.cantidad;
                cantidadTotal += item.cantidad;
                if (producto) {
                    console.log(producto.oferta_activa);
                    const li = document.createElement("li");
                    li.innerHTML = `
                        ${producto.nombre} - ${producto.oferta_activa ? formatearPrecio(precioOferta) : formatearPrecio(producto.precio)} COP
                        <button class="removeProduct" onclick="cambiarCantidad(${item.id}, -1)">➖</button>
                        <span>${item.cantidad}</span>
                        <button class="addProduct" onclick="cambiarCantidad(${item.id}, 1)">➕</button>
                        <button class="deleterProduct" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                    `;
                    carritoLista.appendChild(li);
                }
            });
            totalPrecio.textContent = `COP ${formatearPrecio(total)}`;
            contadorCarrito.textContent = cantidadTotal;
        
        });
}

function cambiarCantidad(id, cambio) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cambio;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1); // Si llega a 0, se elimina del carrito
            if(carrito.length === 0){
                document.getElementById("total-precio").textContent = "COP 0";
            }
        }
    }
    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    if(carrito.length === 0){
        document.getElementById("total-precio").textContent = "COP 0";
    }
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = []; // Vacía el array del carrito
    actualizarCarrito(); // Refresca la vista
    document.getElementById("contador-carrito").textContent = 0;
    document.getElementById("total-precio").textContent = "COP 0";

}

function toggleCarrito() {
    const carritoPanel = document.getElementById("carrito-panel");
    const overlay = document.getElementById("carrito-overlay");

    carritoPanel.classList.toggle("mostrar");
    overlay.classList.toggle("mostrar");
}




function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(valor);
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        let botonTexto = "Comprar";
        let botonClase = "disponible";
        let botonId = "btn-Comprar";
        let deshabilitado = "";

        const fechaLanzamiento = new Date(producto.fecha_lanzamiento);
        const hoy = new Date();
        let mostrarFecha = false;

        if (producto.cantidad === 0) {
            botonTexto = "Agotado";
            botonClase = "agotado";
            botonId = "btn-agotado";
            deshabilitado = "disabled";
        } else if (fechaLanzamiento > hoy) {
            botonTexto = "Próximamente";
            botonClase = "proximamente";
            botonId = "btn-Proximamente";
            deshabilitado = "disabled";
            mostrarFecha = true;
        }

        let precioHTML = `<p class="precio">${formatearPrecio(producto.precio)}</p>`;
        if (producto.oferta_activa) {
            const precioOferta = producto.precio - (producto.precio * producto.descuento / 100);
            precioHTML = `
                <p class="precio-original">${formatearPrecio(producto.precio)}</p>
                <p class="precio">${formatearPrecio(precioOferta)}</p>
            `;
        }

        div.innerHTML = `
            ${producto.oferta_activa ? `<div class="oferta">${producto.descuento}% OFF</div>` : ""}
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            ${precioHTML}
            <p class="cantidad">Disponibles: ${producto.cantidad}</p>
            ${mostrarFecha ? `<p class="fecha">Lanzamiento: ${producto.fecha_lanzamiento}</p>` : ""}
            <button class="${botonClase}"  id="${botonId}"${deshabilitado ? "disabled" : ""} onclick="agregarAlCarrito(${producto.id})">
                ${botonTexto}
            </button>
        `;
        contenedor.appendChild(div);
    });
}


const toggleFiltrosBtn = document.getElementById("toggle-filtros");
const filtrosContainer = document.getElementById("filtros-container");

toggleFiltrosBtn.addEventListener("click", function () {
    filtrosContainer.classList.toggle("mostrar");
});

document.addEventListener("click", function (event) {
    if (!filtrosContainer.contains(event.target) && event.target !== toggleFiltrosBtn) {
        filtrosContainer.classList.remove("mostrar");
    }
});




function mostrarCategorias(categorias) {
    const contenedor = document.getElementById("categoria-checkboxes");
    contenedor.innerHTML = "";

    // Opción "Todos"
    const divTodos = document.createElement("div");
    divTodos.classList.add("categoria-checkbox");

    const checkboxTodos = document.createElement("input");
    checkboxTodos.type = "checkbox";
    checkboxTodos.id = "cat-todos";

    const labelTodos = document.createElement("label");
    labelTodos.htmlFor = "cat-todos";
    labelTodos.textContent = "Todos"; 

   
    divTodos.appendChild(checkboxTodos);
    divTodos.appendChild(labelTodos);
    contenedor.appendChild(divTodos);


    // Crear checkboxes de categorías
    categorias.forEach(categoria => {
        if(categoria.nombre == "Todos"){
            return;
        }
        const div = document.createElement("div");
        div.classList.add("categoria-checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `cat-${categoria.id}`;
        checkbox.value = categoria.id;

        const label = document.createElement("label");
        label.htmlFor = `cat-${categoria.id}`;
        label.textContent = categoria.nombre;

        div.appendChild(checkbox);
        div.appendChild(label);
        contenedor.appendChild(div);

        checkbox.addEventListener("change", filtrarProductos);
    });

    // Evento para "Todos"
    checkboxTodos.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll("#categoria-checkboxes input:not(#cat-todos)");
        checkboxes.forEach(cb => cb.checked = checkboxTodos.checked);
        filtrarProductos();
    });
}

function filtrarProductos() {
    fetch("../json/productos.json")
        .then(response => response.json())
        .then(data => {
            const checkboxes = document.querySelectorAll("#categoria-checkboxes input:checked:not(#cat-todos)");
            const categoriasSeleccionadas = Array.from(checkboxes).map(cb => cb.value);

            let productosFiltrados = data.productos;

            if (categoriasSeleccionadas.length > 0) {
                productosFiltrados = productosFiltrados.filter(p => categoriasSeleccionadas.includes(p.categoria));
            }

            mostrarProductos(productosFiltrados);
        });
}

