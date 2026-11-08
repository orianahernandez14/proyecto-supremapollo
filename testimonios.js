// Conexión independiente para testimonios (Supabase REST).
(function () {
    "use strict";
    const url = "https://wumrhtyztpircywntcdw.supabase.co/rest/v1/testimonios";
    const clave = "sb_publishable_JqC21O-PYQDhTFdMBcXK0Q_TBGibGjj";
    const cabeceras = { apikey: clave, "Content-Type": "application/json" };
    const formulario = document.getElementById("formulario-testimonio");
    const contenedor = document.getElementById("resenas-contenedor");
    if (!formulario || !contenedor) return;

    async function solicitar(urlDestino, opciones) {
        const respuesta = await fetch(urlDestino, opciones);
        if (!respuesta.ok) {
            let detalle = "";
            try {
                const error = await respuesta.json();
                detalle = error.message || error.error || error.code || "";
            } catch (error) {
                detalle = respuesta.statusText;
            }
            throw new Error("Supabase HTTP " + respuesta.status + (detalle ? ": " + detalle : ""));
        }
        return respuesta;
    }

    async function mostrarAprobados() {
        try {
            const respuesta = await solicitar(url + "?select=nombre,estrellas,descripcion&estado=eq.aprobado&order=creado_en.desc&limit=30", {
                headers: cabeceras,
                cache: "no-store"
            });
            const testimonios = await respuesta.json();
            contenedor.replaceChildren();
            if (testimonios.length === 0) {
                const vacio = document.createElement("p");
                vacio.textContent = "Todavía no hay testimonios publicados. ¡Podés dejar el primero!";
                contenedor.appendChild(vacio);
            }
            testimonios.forEach(function (testimonio) {
                const tarjeta = document.createElement("article");
                const estrellas = document.createElement("p");
                estrellas.className = "estrellas";
                estrellas.textContent = "★".repeat(testimonio.estrellas) + "☆".repeat(5 - testimonio.estrellas);
                const descripcion = document.createElement("p");
                descripcion.textContent = testimonio.descripcion;
                const nombre = document.createElement("strong");
                nombre.textContent = testimonio.nombre;
                tarjeta.append(estrellas, descripcion, nombre);
                contenedor.appendChild(tarjeta);
            });
        } catch (error) {
            contenedor.textContent = "No se pudieron cargar las opiniones. " + error.message;
        }
    }

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        const aviso = document.getElementById("testimonio-aviso");
        const boton = document.getElementById("enviar-testimonio");
        const nombre = document.getElementById("testimonio-nombre").value.trim();
        const estrellas = Number(document.getElementById("testimonio-estrellas").value);
        const descripcion = document.getElementById("testimonio-descripcion").value.trim();
        if (nombre.length < 2 || nombre.length > 80 || !Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5 || descripcion.length < 10 || descripcion.length > 800) {
            aviso.textContent = "Revisá el nombre, las estrellas y la descripción.";
            return;
        }
        boton.disabled = true;
        boton.textContent = "Enviando...";
        aviso.textContent = "Conectando con Supabase...";
        try {
            await solicitar(url, {
                method: "POST",
                headers: Object.assign({}, cabeceras, { Prefer: "return=minimal" }),
                body: JSON.stringify({ nombre: nombre, estrellas: estrellas, descripcion: descripcion, estado: "pendiente" })
            });
            formulario.reset();
            aviso.textContent = "¡Gracias! Tu testimonio se guardó y quedó pendiente de aprobación.";
        } catch (error) {
            aviso.textContent = "No se guardó el testimonio. " + error.message;
            console.error("Error al guardar testimonio:", error);
        } finally {
            boton.disabled = false;
            boton.textContent = "Enviar testimonio";
        }
    });
    mostrarAprobados();
})();
