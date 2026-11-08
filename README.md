# Suprema de Pollo - E-commerce

Proyecto final del curso Front End. Tienda de supremas de pollo crudas, listas para cocinar en casa.

## Funcionalidades
- Catálogo de productos consultado mediante fetch a la API REST pública de GitHub.
- Búsqueda y filtro de productos, tarjetas dinámicas.
- Carrito con cantidades editables, eliminación, total y localStorage.
- Aderezados: mínimo 5 kg combinando sabores.
- A granel: mínimo 5 kg por variedad, sin exigir múltiplos de cinco.
- Consulta del pedido por WhatsApp.
- Formulario de contacto preparado para Formspree (requiere configurar el ID).
- HTML semántico, CSS responsive, Flexbox, Grid, Google Fonts y SEO básico.

## Cómo probar
Abrir la página publicada en GitHub Pages. Se necesita conexión a Internet para cargar el catálogo desde la API.

## Archivos
- index.html: estructura y formularios
- styles.css: diseño y responsive
- script.js: fetch, carrito, localStorage, formularios
- catalogo.json: productos
- img/: imágenes

## Pendiente de configurar
Crear un formulario en Formspree y completar la variable formspreeId en script.js. Hasta entonces el formulario muestra un aviso y no envía mensajes.

Esta versión no cobra ni confirma pedidos. Mercado Pago, backoffice y notificaciones automáticas corresponden a una futura etapa comercial.
