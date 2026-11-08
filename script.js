// Tienda de supremas - proyecto final Front End
// Los productos se consultan desde la API REST pública de GitHub.
const urlProductos = "https://api.github.com/repos/orianahernandez14/proyecto-supremapollo/contents/catalogo.json?ref=desarrollo-mvp-js";
const whatsappPedidos = "541126752010";
const formspreeId = ""; // Completar con el ID de Formspree para activar el contacto
const claveCarrito = "supremas-carrito-v1";
const claveFavoritos = "supremas-favoritos-v1";
const claveTema = "supremas-tema-v1";
let favoritos = [];
const testimoniosDemo = [
    { nombre: "Cliente de ejemplo A", estrellas: 5, mensaje: "Me gustó poder combinar los sabores en un solo pedido." },
    { nombre: "Cliente de ejemplo B", estrellas: 4, mensaje: "El carrito me permite calcular fácilmente cuánto voy a pedir." },
    { nombre: "Cliente de ejemplo C", estrellas: 5, mensaje: "La información de cada variedad es fácil de encontrar." },
    { nombre: "Cliente de ejemplo D", estrellas: 3, mensaje: "Sería útil contar con más opciones para coordinar la entrega." }
];
let productos = [];
let carrito = [];

const contenedor = document.getElementById("productos-contenedor");
const estado = document.getElementById("estado-catalogo");
const buscar = document.getElementById("buscar-producto");
const filtro = document.getElementById("filtro-tipo");
const listaCarrito = document.getElementById("carrito-lista");
const mensajeReglas = document.getElementById("carrito-reglas");

function dinero(valor) {
    return "$" + valor.toLocaleString("es-AR");
}

function guardarCarrito() {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
}

function recuperarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(claveCarrito));
        if (Array.isArray(guardado)) carrito = guardado;
    } catch (error) {
        carrito = [];
    }
}

async function cargarProductos() {
    estado.textContent = "Cargando productos...";
    try {
        const respuesta = await fetch(urlProductos);
        if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo: " + respuesta.status);
        const archivo = await respuesta.json();
        const texto = decodeURIComponent(Array.from(atob(archivo.content.replace(/\s/g, "")), letra => "%" + letra.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
        productos = JSON.parse(texto);
        estado.textContent = "";
        mostrarProductos();
        mostrarCarrito();
    } catch (error) {
        console.error(error);
        estado.textContent = "No pudimos cargar los productos. Recargá la página para intentarlo nuevamente.";
    }
}

function mostrarProductos() {
    contenedor.innerHTML = "";
    const texto = buscar.value.toLowerCase().trim();
    const categoria = filtro.value;
    const visibles = productos.filter(function (item) {
        const coincide = (item.nombre + " " + item.descripcion).toLowerCase().includes(texto);
        return coincide && (categoria === "todos" || item.tipo === categoria || (categoria === "favoritos" && favoritos.includes(item.id)));
    });
    if (visibles.length === 0) estado.textContent = "No encontramos productos con esos filtros.";
    else estado.textContent = "";
    visibles.forEach(function (item) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";
        const favorito = document.createElement("button");
        favorito.type = "button";
        favorito.className = "boton-favorito";
        favorito.textContent = favoritos.includes(item.id) ? "♥" : "♡";
        favorito.setAttribute("aria-label", favoritos.includes(item.id) ? "Quitar " + item.nombre + " de favoritos" : "Guardar " + item.nombre + " en favoritos");
        favorito.setAttribute("aria-pressed", favoritos.includes(item.id) ? "true" : "false");
        favorito.addEventListener("click", function () { alternarFavorito(item.id); });
        const imagen = document.createElement("img");
        imagen.className = "producto__imagen";
        imagen.src = item.imagen;
        imagen.alt = item.nombre + " crudo, listo para cocinar";
        const titulo = document.createElement("h3");
        titulo.textContent = item.nombre;
        const descripcion = document.createElement("p");
        descripcion.textContent = item.descripcion;
        const precio = document.createElement("p");
        precio.className = "precio";
        precio.textContent = dinero(item.precio) + " por kg";
        const etiqueta = document.createElement("label");
        etiqueta.textContent = "Cantidad (kg)";
        const cantidad = document.createElement("input");
        cantidad.type = "number";
        cantidad.min = "0.5";
        cantidad.step = "0.5";
        cantidad.value = item.tipo === "granel" ? "5" : "1";
        cantidad.className = "cantidad-producto";
        cantidad.setAttribute("aria-label", "Cantidad en kg de " + item.nombre);
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Agregar al carrito";
        boton.addEventListener("click", function () {
            const agregado = agregarProducto(item.id, Number(cantidad.value));
            if (agregado) {
                boton.classList.add("agregado");
                boton.textContent = "✓ Agregado al carrito";
                setTimeout(function () {
                    boton.classList.remove("agregado");
                    boton.textContent = "Agregar al carrito";
                }, 1200);
            }
        });
        tarjeta.append(imagen, favorito, titulo, descripcion, precio, etiqueta, cantidad, boton);
        contenedor.appendChild(tarjeta);
    });
}

function agregarProducto(id, cantidad) {
    if (!Number.isFinite(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad * 2)) {
        estado.textContent = "Ingresá una cantidad válida en pasos de 0,5 kg.";
        return false;
    }
    const item = productos.find(function (p) { return p.id === id; });
    if (!item) return false;
    const existente = carrito.find(function (p) { return p.id === id; });
    if (existente) existente.cantidad += cantidad;
    else carrito.push({ id: id, cantidad: cantidad });
    guardarCarrito();
    mostrarCarrito();
    estado.textContent = item.nombre + " agregado al carrito.";
    return true;
}

function cambiarCantidad(id, cantidad) {
    if (!Number.isFinite(cantidad) || cantidad < 0 || !Number.isInteger(cantidad * 2)) {
        mensajeReglas.textContent = "Usá cantidades válidas de 0,5 kg.";
        return;
    }
    const producto = productos.find(function (p) { return p.id === id; });
    if (producto && producto.tipo === "granel" && cantidad > 0 && cantidad < 5) {
        mensajeReglas.textContent = "El pollo a granel no puede ser menor a 5 kg. Usá Eliminar para quitarlo.";
        mostrarCarrito();
        return;
    }
    if (cantidad === 0) carrito = carrito.filter(function (p) { return p.id !== id; });
    else {
        const item = carrito.find(function (p) { return p.id === id; });
        if (item) item.cantidad = cantidad;
    }
    guardarCarrito();
    mostrarCarrito();
}

function validarCompra() {
    if (carrito.length === 0) return "Agregá productos al carrito.";
    let aderezados = 0;
    for (const item of carrito) {
        const producto = productos.find(function (p) { return p.id === item.id; });
        if (!producto) return "Hay productos que ya no están disponibles.";
        if (producto.tipo === "granel" && item.cantidad < 5) return "El pollo a granel requiere al menos 5 kg de la misma variedad.";
        if (producto.tipo === "aderezado") aderezados += item.cantidad;
    }
    if (aderezados > 0 && aderezados < 5) return "Los aderezados deben sumar al menos 5 kg entre todos los sabores.";
    return "";
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;
    carrito.forEach(function (item) {
        const producto = productos.find(function (p) { return p.id === item.id; });
        if (!producto) return;
        total += producto.precio * item.cantidad;
        cantidadTotal += item.cantidad;
        const fila = document.createElement("div");
        fila.className = "carrito-fila";
        const nombre = document.createElement("strong");
        nombre.textContent = producto.nombre + " - " + dinero(producto.precio * item.cantidad);
        const cantidad = document.createElement("input");
        cantidad.type = "number";
        cantidad.min = producto.tipo === "granel" ? "5" : "0.5";
        cantidad.step = "0.5";
        cantidad.value = item.cantidad;
        cantidad.setAttribute("aria-label", "Kilos de " + producto.nombre);
        cantidad.addEventListener("change", function () { cambiarCantidad(item.id, Number(cantidad.value)); });
        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.textContent = "Eliminar";
        quitar.addEventListener("click", function () { cambiarCantidad(item.id, 0); });
        fila.append(nombre, cantidad, quitar);
        listaCarrito.appendChild(fila);
    });
    if (carrito.length === 0) listaCarrito.textContent = "Todavía no agregaste productos.";
    document.getElementById("carrito-total").textContent = dinero(total);
    document.getElementById("contador-carrito").textContent = carrito.length;
    const contadorFlotante = document.getElementById("contador-flotante");
    if (contadorFlotante) contadorFlotante.textContent = carrito.length;
    document.getElementById("carrito-cantidad").textContent = cantidadTotal + " kg";
    mensajeReglas.textContent = validarCompra() || "Tu pedido cumple las cantidades mínimas.";
}

document.getElementById("vaciar-carrito").addEventListener("click", function () {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
});
buscar.addEventListener("input", mostrarProductos);
filtro.addEventListener("change", mostrarProductos);

document.getElementById("formulario-pedido").addEventListener("submit", function (evento) {
    evento.preventDefault();
    const aviso = document.getElementById("pedido-aviso");
    const error = validarCompra();
    if (error) { aviso.textContent = error; return; }
    const nombre = document.getElementById("pedido-nombre").value.trim();
    const telefono = document.getElementById("pedido-telefono").value.trim();
    const zona = document.getElementById("pedido-zona").value.trim();
    const dia = document.getElementById("pedido-dia").value;
    if (!nombre || !telefono || !zona || !dia) { aviso.textContent = "Completá todos los campos."; return; }
    let mensaje = "Hola, quiero consultar este pedido de Suprema de Pollo:\n";
    let total = 0;
    carrito.forEach(function (item) {
        const p = productos.find(function (producto) { return producto.id === item.id; });
        if (p) {
            const subtotal = p.precio * item.cantidad;
            total += subtotal;
            mensaje += "- " + p.nombre + ": " + item.cantidad + " kg (" + dinero(subtotal) + ")\n";
        }
    });
    mensaje += "Total estimado: " + dinero(total) + "\n";
    mensaje += "Nombre: " + nombre + "\nTeléfono: " + telefono + "\nZona: " + zona + "\nDía preferido: " + dia;
    mensaje += "\nQuiero consultar disponibilidad y coordinar la entrega.";
    aviso.textContent = "Se abrirá WhatsApp para enviar tu consulta.";
    window.open("https://wa.me/" + whatsappPedidos + "?text=" + encodeURIComponent(mensaje), "_blank", "noopener");
});

document.getElementById("formulario-contacto").addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const aviso = document.getElementById("contacto-aviso");
    if (!formspreeId) {
        aviso.textContent = "El envío no está disponible en este momento. Podés contactarnos por WhatsApp.";
        return;
    }
    aviso.textContent = "Enviando...";
    try {
        const respuesta = await fetch("https://formspree.io/f/" + formspreeId, {
            method: "POST",
            body: new FormData(evento.target),
            headers: { Accept: "application/json" }
        });
        if (!respuesta.ok) throw new Error("Error al enviar");
        aviso.textContent = "¡Mensaje enviado!";
        evento.target.reset();
    } catch (error) {
        aviso.textContent = "No se pudo enviar. Intentá nuevamente.";
    }
});

recuperarCarrito();
cargarProductos();

function alternarFavorito(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(function (favorito) { return favorito !== id; });
    } else {
        favoritos.push(id);
    }
    localStorage.setItem(claveFavoritos, JSON.stringify(favoritos));
    mostrarProductos();
}

function cargarPreferencias() {
    try {
        const guardados = JSON.parse(localStorage.getItem(claveFavoritos));
        if (Array.isArray(guardados)) favoritos = guardados;
    } catch (error) {
        favoritos = [];
    }
    if (localStorage.getItem(claveTema) === "oscuro") document.body.classList.add("modo-oscuro");
    actualizarBotonTema();
}

function actualizarBotonTema() {
    const boton = document.getElementById("cambiar-tema");
    const oscuro = document.body.classList.contains("modo-oscuro");
    boton.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
    boton.setAttribute("aria-pressed", String(oscuro));
}

document.getElementById("cambiar-tema").addEventListener("click", function () {
    document.body.classList.toggle("modo-oscuro");
    const oscuro = document.body.classList.contains("modo-oscuro");
    localStorage.setItem(claveTema, oscuro ? "oscuro" : "claro");
    actualizarBotonTema();
});

function mostrarResenas() {
    const filtroResenas = document.getElementById("filtro-resenas").value;
    const contenedorResenas = document.getElementById("resenas-contenedor");
    contenedorResenas.innerHTML = "";
    const visibles = testimoniosDemo.filter(function (resena) {
        return filtroResenas === "todas" || resena.estrellas === Number(filtroResenas);
    });
    visibles.forEach(function (resena) {
        const tarjeta = document.createElement("article");
        const estrellas = document.createElement("p");
        estrellas.className = "estrellas";
        estrellas.textContent = "★".repeat(resena.estrellas) + "☆".repeat(5 - resena.estrellas);
        const mensaje = document.createElement("p");
        mensaje.textContent = "“" + resena.mensaje + "”";
        const nombre = document.createElement("strong");
        nombre.textContent = resena.nombre + " · Demostración";
        tarjeta.append(estrellas, mensaje, nombre);
        contenedorResenas.appendChild(tarjeta);
    });
    document.getElementById("resenas-estado").textContent = visibles.length + " opiniones de demostración.";
}
document.getElementById("filtro-resenas").addEventListener("change", mostrarResenas);
cargarPreferencias();
mostrarResenas();

const recetas = [
    { nombre: "Supremas al horno con hierbas", tiempo: "35-40 min", dificultad: "Fácil", imagen: "img/suprema-pollo.png", ingredientes: "Supremas, limón, aceite de oliva, romero, ajo y pimienta.", pasos: "Precalentá el horno a 200 °C. Colocá las supremas en una fuente, condimentá y agregá limón. Horneá hasta que estén bien cocidas y alcancen 74 °C en el centro." },
    { nombre: "Supremas a la plancha", tiempo: "20-25 min", dificultad: "Fácil", imagen: "img/pollo-provenzal.png", ingredientes: "Supremas provenzal, aceite y unas gotas de limón.", pasos: "Calentá una sartén con un poco de aceite. Cociná las supremas de ambos lados a fuego medio hasta que estén doradas y alcancen 74 °C en el centro." },
    { nombre: "Supremas con mostaza y vegetales", tiempo: "35 min", dificultad: "Fácil", imagen: "img/pollo-mostaza.png", ingredientes: "Supremas a la mostaza, zanahoria, papa, cebolla y aceite.", pasos: "Cortá los vegetales, colocalos en una fuente con las supremas y un poco de aceite. Horneá hasta que los vegetales estén tiernos y el pollo alcance 74 °C en el centro." },
    { nombre: "Supremas al pimentón con arroz", tiempo: "30-35 min", dificultad: "Fácil", imagen: "img/pollo-pimenton.png", ingredientes: "Supremas al pimentón, arroz, agua, aceite y perejil.", pasos: "Prepará el arroz por separado. Cociná las supremas en sartén hasta alcanzar 74 °C en el centro y servilas sobre el arroz con perejil fresco." }
];
let indiceRecetas = 0;
function mostrarRecetas() {
    const contenedorRecetas = document.getElementById("recetas-contenedor");
    contenedorRecetas.innerHTML = "";
    recetas.forEach(function (receta, indice) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "receta-tarjeta";
        if (indice < indiceRecetas || indice >= indiceRecetas + 3) tarjeta.classList.add("receta-oculta");
        const imagen = document.createElement("img");
        imagen.src = receta.imagen;
        imagen.alt = "Suprema cruda para preparar " + receta.nombre;
        const contenido = document.createElement("div");
        const titulo = document.createElement("h3");
        titulo.textContent = receta.nombre;
        const meta = document.createElement("p");
        meta.className = "receta-meta";
        meta.textContent = receta.tiempo + " · " + receta.dificultad;
        const detalle = document.createElement("details");
        const resumen = document.createElement("summary");
        resumen.textContent = "Ver receta";
        const ingredientes = document.createElement("p");
        ingredientes.textContent = "Ingredientes: " + receta.ingredientes;
        const pasos = document.createElement("p");
        pasos.textContent = receta.pasos;
        detalle.append(resumen, ingredientes, pasos);
        contenido.append(titulo, meta, detalle);
        tarjeta.append(imagen, contenido);
        contenedorRecetas.appendChild(tarjeta);
    });
}
document.getElementById("recetas-anterior").addEventListener("click", function () {
    indiceRecetas = Math.max(0, indiceRecetas - 1);
    mostrarRecetas();
});
document.getElementById("recetas-siguiente").addEventListener("click", function () {
    indiceRecetas = Math.min(recetas.length - 3, indiceRecetas + 1);
    mostrarRecetas();
});
document.getElementById("abrir-carrito").addEventListener("click", function () {
    document.getElementById("hacer-pedido").scrollIntoView({ behavior: "smooth" });
});
mostrarRecetas();
