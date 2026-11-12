# Suprema de Pollo 🐔

**Proyecto final de Front End | E-commerce**

🔗 **[Ver la página publicada](https://orianahernandez14.github.io/proyecto-supremapollo/)**

## Sobre mi proyecto

Desarrollé **Suprema de Pollo** como trabajo final de mi curso de Front End. Mi idea fue crear una tienda online de supremas de pollo crudas, tanto naturales como aderezadas, que se puedan pedir de manera sencilla desde una computadora o un celular.

Estoy en una etapa de formación como desarrolladora, por eso traté de aplicar los temas que fui aprendiendo y mantener una estructura que pueda leer, comprender y seguir mejorando. También quise aprovechar la entrega para avanzar con un **proyecto personal real**: no solamente mostrar una página visualmente terminada, sino conseguir que sus funcionalidades tengan sentido para un posible uso comercial.

## ¿Qué desarrollé?

- Armé la estructura con **HTML semántico** y separé los estilos en **CSS**.
- Trabajé el diseño adaptable a diferentes pantallas con **media queries, Flexbox y CSS Grid**.
- Utilicé **JavaScript** para interactuar con el DOM, crear las tarjetas de productos y gestionar los eventos de los formularios y botones.
- Cargué el catálogo desde un archivo JSON consultado con **fetch a la API REST pública de GitHub**.
- Agregué búsqueda y filtros para facilitar la navegación por los productos.
- Programé un **carrito de compras** que permite agregar productos, cambiar cantidades, eliminar productos y calcular el total.
- Utilicé **localStorage** para conservar el carrito cuando se recarga la página.
- Incorporé una confirmación visual: el botón de un producto agregado cambia de color.
- Agregué validaciones de compra según el tipo de producto.
- Preparé un pedido por **WhatsApp**, con un mensaje que resume los productos elegidos.
- Conecté el formulario de contacto con **Supabase**, para guardar las consultas en PostgreSQL.
- Incorporé un sistema de testimonios con calificación por estrellas y aprobación antes de publicarlos.
- Publiqué el sitio utilizando **GitHub Pages**.

## Reglas del carrito

En mi proyecto los productos se venden por kilogramo y tienen condiciones distintas:

- **Pollo a granel:** mínimo 5 kg por variedad. Se pueden elegir cantidades superiores sin necesidad de que sean múltiplos de cinco.
- **Pollo aderezado:** mínimo 5 kg en total, combinando los sabores disponibles.

El carrito muestra las cantidades y el importe estimado. **No procesa pagos ni confirma pedidos automáticamente**: el cliente revisa el resumen y decide si lo envía por WhatsApp.

## Las conexiones que incorporé

### GitHub y su API REST

Guardé el código en GitHub y publiqué la página con GitHub Pages. Para practicar el uso de APIs y JavaScript asíncrono, decidí obtener los productos desde el archivo `catalogo.json` mediante la API pública de GitHub. Después, con JavaScript, transformo esos datos en las tarjetas que se ven en la tienda.

### Formulario de contacto en Supabase

Al principio utilicé Formspree, pero después decidí centralizar también las consultas en **Supabase**. El formulario guarda nombre, correo electrónico y mensaje en una tabla PostgreSQL con políticas RLS: cualquier visitante puede enviar una consulta, pero solo los administradores autorizados pueden leerla. Por ahora reviso las consultas desde el panel de tablas de Supabase; todavía no implementé avisos por correo ni un gestor de consultas dentro de la web.

### WhatsApp

Integré un enlace que arma el resumen del pedido para que el cliente pueda continuar la conversación por WhatsApp. Elegí este recorrido porque, en esta etapa del proyecto, prefiero coordinar manualmente los pedidos y las entregas.

### Supabase

Esta fue una decisión que va un poco más allá de lo que se esperaba para la entrega de Front End.

Conecté **Supabase** para almacenar testimonios en una base de datos PostgreSQL. También preparé un panel de administración donde puedo iniciar sesión, revisar las opiniones recibidas y aprobarlas o rechazarlas. Los comentarios aprobados son los que se muestran públicamente.

Entiendo que para un trabajo centrado en Front End podía resolver esta parte de una forma más simple, por ejemplo, utilizando testimonios fijos en el HTML. Sin embargo, **estoy estudiando programación y bases de datos**, y ya tengo conocimientos que quería poner en práctica. Por eso decidí integrar una herramienta adicional, aprender cómo se conecta con el frontend y trabajar con permisos de acceso.

Mi intención no fue complicar la consigna, sino aprovecharla para construir algo que también me sirva fuera del curso. Quiero que esta tienda pueda seguir creciendo como un proyecto personal y que las personas realmente puedan utilizarla.

Para proteger la administración configuré autenticación y políticas de acceso (**Row Level Security o RLS**) en Supabase. La clave pública utilizada por el navegador no reemplaza esas políticas de seguridad.

## Tecnologías y herramientas

- **HTML5:** estructura de la página.
- **CSS3, Flexbox, Grid y media queries:** estilos y diseño responsive.
- **JavaScript:** DOM, eventos, validaciones, `fetch` y `localStorage`.
- **JSON y API REST de GitHub:** catálogo de productos.
- **Git y GitHub:** control de versiones y trabajo con ramas.
- **GitHub Pages:** publicación.
- **Supabase:** formulario de contacto, almacenamiento de consultas y testimonios.
- **WhatsApp:** preparación del pedido.
- **Supabase, PostgreSQL y autenticación:** almacenamiento y moderación de testimonios.

## ¿Cómo se puede probar?

1. Entrar a la [tienda publicada](https://orianahernandez14.github.io/proyecto-supremapollo/).
2. Buscar productos y agregar distintas cantidades al carrito.
3. Verificar los mínimos de compra, modificar cantidades y eliminar productos.
4. Preparar el pedido y comprobar que se genera el mensaje para WhatsApp (pueden enviarlo o no, indicar que es test).
5. Enviar una consulta desde el formulario de contacto.
6. Dejar un testimonio con nombre, estrellas y descripción. La opinión queda pendiente de aprobación.
7. Revisar la experiencia desde un celular y desde una computadora.

El [panel de administración de testimonios](https://orianahernandez14.github.io/proyecto-supremapollo/admin-testimonios.html) requiere una cuenta autorizada y no está pensado para visitantes.

## Organización de los archivos

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura de la tienda y formularios. |
| `styles.css` | Diseño y adaptación a diferentes pantallas. |
| `script.js` | Catálogo, carrito y lógica principal. |
| `catalogo.json` | Información y precios de productos. |
| `testimonios.js` | Envío y visualización de testimonios con Supabase. |
| `admin-testimonios.html` | Acceso y moderación de testimonios. |
| `supabase-testimonios.sql` | Estructura y políticas de seguridad de los testimonios. |
| `supabase-consultas.sql` | Tabla y políticas RLS para recibir consultas de contacto. |
| `img/` | Imágenes utilizadas en el sitio. |

## Lo que aprendí y lo que quiero seguir mejorando

Este proyecto me permitió unir temas que antes practicaba por separado: maquetación, estilos, JavaScript, consumo de APIs, persistencia de datos y publicación de una web.

También aprendí que lograr que algo funcione implica probarlo, encontrar errores y corregirlos. Durante el desarrollo tuve que ajustar las reglas del carrito, revisar la publicación de las ramas y resolver permisos de la base de datos para que los testimonios se mostraran correctamente.

Sé que todavía hay cosas por mejorar, como la experiencia de usuario, las pruebas en distintos dispositivos y una futura integración de pagos o gestión de pedidos. **Para mí, esta entrega es una primera versión funcional y una base sobre la que quiero seguir aprendiendo y construyendo.**

---

**Estado de la entrega:** el código final está integrado en la rama `main`.
