// Pedido de Suprema de Pollo
// Valores de referencia para calcular el total
const precioGranel = 11499;
const precioAderezado = 16999;
const whatsappPedidos = "541126752010";

const formulario = document.getElementById("formulario-pedido");
const producto = document.getElementById("pedido-producto");
const kilos = document.getElementById("pedido-kilos");
const total = document.getElementById("pedido-total");
const aviso = document.getElementById("pedido-aviso");
const botonesProducto = document.querySelectorAll(".elegir-producto");

function calcularPrecio() {
    let cantidad = Number(kilos.value);
    let precio = precioAderezado;

    if (producto.value === "granel") {
        precio = precioGranel;
    }

    if (cantidad < 5 || !Number.isFinite(cantidad)) {
        total.textContent = "Ingresá 5 kg o más";
        return;
    }

    let resultado = cantidad * precio;
    total.textContent = "$" + resultado.toLocaleString("es-AR");
}

function elegirProducto(nombre) {
    producto.value = nombre;
    calcularPrecio();
    document.getElementById("hacer-pedido").scrollIntoView({ behavior: "smooth" });
}

for (let i = 0; i < botonesProducto.length; i++) {
    botonesProducto[i].addEventListener("click", function (evento) {
        evento.preventDefault();
        elegirProducto(botonesProducto[i].dataset.producto);
    });
}

producto.addEventListener("change", calcularPrecio);
kilos.addEventListener("input", calcularPrecio);

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let cantidad = Number(kilos.value);
    let nombre = document.getElementById("pedido-nombre").value.trim();
    let telefono = document.getElementById("pedido-telefono").value.trim();
    let zona = document.getElementById("pedido-zona").value.trim();
    let dia = document.getElementById("pedido-dia").value;

    if (!nombre || !telefono || !zona || !dia) {
        aviso.textContent = "Completá los datos para preparar tu pedido.";
        return;
    }

    if (!Number.isFinite(cantidad) || cantidad < 5) {
        aviso.textContent = "La compra mínima es de 5 kg.";
        return;
    }

    let nombreProducto = producto.options[producto.selectedIndex].text;
    let precio = producto.value === "granel" ? precioGranel : precioAderezado;
    let importe = cantidad * precio;

    let mensaje = "Hola, quiero consultar por este pedido de Suprema de Pollo:\n";
    mensaje += "Nombre: " + nombre + "\n";
    mensaje += "Teléfono: " + telefono + "\n";
    mensaje += "Producto: " + nombreProducto + "\n";
    mensaje += "Cantidad: " + cantidad + " kg\n";
    mensaje += "Total estimado: $" + importe.toLocaleString("es-AR") + "\n";
    mensaje += "Zona: " + zona + "\n";
    mensaje += "Día preferido: " + dia + "\n";
    mensaje += "Quisiera confirmar disponibilidad y coordinar la entrega.";

    aviso.textContent = "Se abrirá WhatsApp para enviar tu consulta.";
    window.open("https://wa.me/" + whatsappPedidos + "?text=" + encodeURIComponent(mensaje), "_blank", "noopener");
});

calcularPrecio();
