# Recupérate pronto 🌷

Tarjeta digital interactiva con buenos deseos para alguien que se está recuperando.
HTML + CSS + JS estático, con GSAP, Bootstrap y Tailwind. Funciona en GitHub Pages sin backend.

## Uso

| URL | Resultado |
| --- | --- |
| `https://usuario.github.io/recuperate-pronto/` | Tarjeta sin nombre |
| `https://usuario.github.io/recuperate-pronto/Ana` | Tarjeta con el cartel "Para Ana" |
| `https://usuario.github.io/recuperate-pronto/Mar%C3%ADa` | "Para María" |

El nombre **solo** se lee del último segmento de la URL. No hay formularios, no se guarda y no está escrito en el código.

## Cómo funciona la ruta con nombre

GitHub Pages no tiene reescritura de rutas: `/recuperate-pronto/Ana` no existe como archivo, así que sirve `404.html`.

- `index.html` → `data-route="home"` → nunca muestra nombre.
- `404.html` → copia exacta de `index.html` con `data-route="name"` → toma el último segmento de la URL como nombre.
- En `404.html` un pequeño script en `<head>` añade `<base href="/<repo>/">` para que los recursos relativos (`./assets/...`) carguen bien.

Supuestos: sitio de proyecto en `*.github.io/<repo>/` (la base es el primer segmento) o sitio en la raíz de un dominio (la base es todo menos el último segmento).

> Nota: GitHub Pages responde a `/recuperate-pronto/Ana` con estado HTTP 404, aunque la página se ve completa. Es lo habitual con este método y no afecta al visitante.

## Estructura

```
index.html                 Página principal
404.html                   Copia de index.html con data-route="name"
assets/css/styles.css      Paleta, tipografía, superficies, flores
assets/css/tailwind.css    Utilidades Tailwind compiladas (prefijo tw-)
assets/css/tailwind.input.css
assets/js/main.js          Nombre desde la URL, flores y timeline GSAP
tailwind.config.js         Config de Tailwind (prefijo tw-, sin preflight)
.nojekyll                  Publicar los archivos tal cual, sin Jekyll
```

Reparto de frameworks: Bootstrap para estructura (`container`, flex, `min-vh-100`, `.btn`); Tailwind (prefijo `tw-`, sin preflight) para espaciado y anchos.

## Desarrollo

Tras editar `index.html`:

```bash
# 1. Regenerar 404.html
sed 's/data-route="home"/data-route="name"/' index.html > 404.html

# 2. Si cambiaste clases tw-, recompilar Tailwind
npx tailwindcss@3 -c tailwind.config.js -i assets/css/tailwind.input.css -o assets/css/tailwind.css --minify
```

Para probar localmente basta un servidor estático (`python -m http.server`) en `/`. Para probar la ruta con nombre, abre `/404.html` o usa un servidor que devuelva `404.html` en rutas desconocidas.

## Publicar en GitHub Pages

1. Sube el repositorio a GitHub (por ejemplo `recuperate-pronto`).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Rama `main`, carpeta `/ (root)` → **Save**.
4. En uno o dos minutos estará en `https://<usuario>.github.io/<repo>/`.
