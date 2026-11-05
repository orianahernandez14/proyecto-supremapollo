# Bitácora del proyecto

## 05/11/2026 - Primer avance con JavaScript

### Punto de partida
La página tenía cinco tarjetas de productos, imágenes, navegación y botones que abrían WhatsApp. El archivo CSS tenía llaves sin cerrar en las reglas para tablet y celular.

### Qué se cambió
1. Se agregó un formulario para preparar un pedido sin salir de la página.
2. Cada tarjeta permite elegir una variedad y llevarla al formulario.
3. JavaScript calcula el importe según los kilos y el producto.
4. Se controla la compra mínima de 5 kg.
5. El botón prepara un mensaje con los datos del pedido y abre WhatsApp.
6. Se corrigieron las Media Queries para que los estilos responsive se apliquen correctamente.
7. Se reemplazaron los enlaces de WhatsApp anteriores por el número principal actual. El segundo número queda informado como alternativa.

### Qué aprendí
- `const` guarda referencias o valores que no reasigno.
- `let` permite cambiar un valor durante el programa.
- `getElementById` busca un elemento por su identificador.
- `querySelectorAll` encuentra varios elementos.
- `addEventListener` ejecuta una función cuando ocurre un evento.
- `if` permite validar condiciones.
- `function` permite reutilizar instrucciones.
- `textContent` modifica texto visible sin modificar el HTML completo.
- `preventDefault` evita el envío tradicional del formulario.

### Cómo probar
1. Abrir `index.html` en el navegador.
2. Ir a Productos y pulsar «Elegir» en una tarjeta.
3. Verificar que el selector del formulario cambie.
4. Escribir 4 kg: debe aparecer la advertencia de compra mínima.
5. Escribir 5 kg: debe mostrarse el total.
6. Completar nombre, teléfono, zona y día.
7. Pulsar el botón y comprobar que se abra WhatsApp con el mensaje.
8. Repetir en una pantalla de celular.

### Pendientes
- Confirmar el funcionamiento en un celular real.
- Configurar un formulario de contacto con Formspree, si se exige en la entrega.
- Revisar accesibilidad, ortografía, y fotografías.
- Publicar la rama aprobada en `main` y habilitar GitHub Pages.

### Nota de alcance
Esta versión **no registra ni confirma pedidos**: únicamente calcula un total estimado y prepara una consulta por WhatsApp. No se cobran pagos desde la web.
