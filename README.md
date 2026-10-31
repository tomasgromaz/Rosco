# Rosco de Educación Física (Pasapalabra)

Juego de rosco tipo Pasapalabra con preguntas de educación física (con contenido de la Provincia de Buenos Aires y de Argentina), para jugar en el navegador. Está hecho con HTML, CSS y JavaScript puros: no necesita instalar nada.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La página |
| `estilos.css` | Colores y diseño |
| `juego.js` | La lógica del juego |
| `preguntas.js` | Las preguntas y el tiempo de la partida (**el que vas a editar**) |

## Cómo jugarlo

1. Tocá **Jugar**: empieza la cuenta regresiva.
2. Leé la definición de la letra marcada y escribí la respuesta.
3. **Responder** (o Enter) corrige la respuesta. **Pasapalabra** la deja para más tarde.
4. Terminás cuando completás todas las letras o se acaba el tiempo.

Las tildes no importan al responder.

## Sonidos

El juego suena al acertar (tres notas que suben), al errar (zumbido grave) y al pasar (dos bips). Los sonidos se generan con código, así que no hay archivos de audio. El botón **Sonido** de arriba los silencia y el navegador se acuerda de la elección. Para cambiar cómo suenan, se editan las notas en la función `sonar` de `juego.js`.

## Cómo editar las preguntas

Abrí `preguntas.js` y cambiá lo que quieras. Cada letra se ve así:

```js
{ letra: "H", tipo: "empieza", pregunta: "Deporte de equipo que se juega con las manos...", respuesta: "Handball", alternativas: ["Balonmano"] }
```

- `tipo` puede ser `"empieza"` (Con la H) o `"contiene"` (Contiene la H). En este rosco la Ñ y la X son "contiene", porque casi no hay palabras de educación física que empiecen con ellas.
- `alternativas` es opcional: otras respuestas que también valen.
- El rosco tiene las 27 letras (A–Z con la Ñ, incluidas la K y la W), pero no es obligatorio usarlas todas: se arma con las entradas que haya.
- El tiempo de la partida se cambia en `CONFIG.tiempo` (en segundos).

## Cómo subirlo a GitHub y publicarlo

1. Entrá a [github.com](https://github.com) y creá un repositorio nuevo (**New repository**), por ejemplo `rosco`. Dejalo en público.
2. En el repositorio, tocá **Add file → Upload files** y arrastrá los 5 archivos de esta carpeta. Después tocá **Commit changes**.
3. Andá a **Settings → Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guardá.
5. Esperá uno o dos minutos. La página queda en `https://TU-USUARIO.github.io/rosco/`.

Para cambiar preguntas más adelante, abrí `preguntas.js` en GitHub, tocá el lápiz (**Edit**), modificá y hacé **Commit changes**. La página se actualiza sola.
