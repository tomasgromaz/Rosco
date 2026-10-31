/* ============================================================
   Lógica del rosco. Las preguntas están en preguntas.js
   ============================================================ */
(function () {
  "use strict";

  // ---------- Referencias al HTML ----------
  var $ = function (id) { return document.getElementById(id); };
  var elRosco = $("rosco");
  var elTiempo = $("tiempo");
  var elAciertos = $("aciertos");
  var elErrores = $("errores");
  var pantallaInicio = $("pantalla-inicio");
  var pantallaJuego = $("pantalla-juego");
  var pantallaFin = $("pantalla-fin");
  var elTipo = $("tipo");
  var elPregunta = $("pregunta");
  var elInput = $("respuesta");
  var elAviso = $("aviso");

  var TIEMPO = (typeof CONFIG !== "undefined" && CONFIG.tiempo) || 150;
  var TITULO = (typeof CONFIG !== "undefined" && CONFIG.titulo) || "Pasapalabra";

  var items = [];      // copia de las preguntas con su estado
  var letrasEl = [];   // los círculos del rosco
  var actual = -1;     // índice de la letra en juego
  var jugando = false;
  var timer = null;

  // ---------- Utilidades ----------

  // Pasa a minúsculas y quita tildes y signos para comparar respuestas.
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function mostrarPantalla(cual) {
    pantallaInicio.hidden = cual !== "inicio";
    pantallaJuego.hidden = cual !== "juego";
    pantallaFin.hidden = cual !== "fin";
  }

  function aviso(texto, clase) {
    elAviso.textContent = texto || "";
    elAviso.className = "aviso" + (clase ? " " + clase : "");
  }

  // ---------- Sonidos ----------
  // Se generan con código (Web Audio), así que no hace falta subir archivos de audio.

  var audioCtx = null;
  var sonidoActivo = true;
  var CLAVE_SONIDO = "rosco-sonido";

  try {
    if (window.localStorage.getItem(CLAVE_SONIDO) === "no") sonidoActivo = false;
  } catch (e) { /* sin almacenamiento: queda activado */ }

  // El navegador solo deja activar el audio después de un toque del usuario.
  function prepararAudio() {
    if (!audioCtx) {
      var AC = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
      if (!AC) return;
      try { audioCtx = new AC(); } catch (e) { audioCtx = null; return; }
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  // Una nota: frecuencia (Hz), cuándo empieza (s), cuánto dura (s), forma de onda, volumen.
  function nota(freq, inicio, dur, tipo, volumen) {
    var t0 = audioCtx.currentTime + inicio;
    var osc = audioCtx.createOscillator();
    var gan = audioCtx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(freq, t0);
    gan.gain.setValueAtTime(0.0001, t0);
    gan.gain.exponentialRampToValueAtTime(volumen, t0 + 0.02);
    gan.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gan);
    gan.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function sonar(cual) {
    if (!sonidoActivo) return;
    prepararAudio();
    if (!audioCtx) return;
    try {
      if (cual === "acierto") {
        // tres notas que suben: do - mi - sol
        nota(523.25, 0, 0.12, "triangle", 0.3);
        nota(659.25, 0.1, 0.12, "triangle", 0.3);
        nota(783.99, 0.2, 0.3, "triangle", 0.3);
      } else if (cual === "error") {
        // zumbido grave que baja
        nota(160, 0, 0.2, "sawtooth", 0.18);
        nota(110, 0.2, 0.35, "sawtooth", 0.18);
      } else if (cual === "pasapalabra") {
        // dos bips iguales y suaves
        nota(500, 0, 0.09, "sine", 0.35);
        nota(500, 0.14, 0.09, "sine", 0.35);
      }
    } catch (e) { /* si el audio falla, el juego sigue sin sonido */ }
  }

  function mostrarBotonSonido() {
    var b = $("btn-sonido");
    b.textContent = sonidoActivo ? "🔊 Sonido: sí" : "🔇 Sonido: no";
    b.setAttribute("aria-pressed", sonidoActivo ? "true" : "false");
  }

  function alternarSonido() {
    sonidoActivo = !sonidoActivo;
    try { window.localStorage.setItem(CLAVE_SONIDO, sonidoActivo ? "si" : "no"); } catch (e) { /* ignorar */ }
    mostrarBotonSonido();
    if (sonidoActivo) sonar("acierto"); // para que se escuche cómo suena
  }

  // ---------- Armado del rosco ----------

  function crearRosco() {
    letrasEl.forEach(function (el) { el.remove(); });
    letrasEl = [];
    var n = items.length;
    var radio = 44; // % del tamaño del rosco
    // Cada círculo mide 9% del rosco; si hay muchas letras se achica para que no se pisen.
    var tam = n > 1 ? Math.min(9, 2 * radio * Math.sin(Math.PI / n) * 0.86) : 9;
    for (var i = 0; i < n; i++) {
      var ang = (-90 + (360 / n) * i) * Math.PI / 180;
      var el = document.createElement("div");
      el.className = "letra";
      el.style.width = tam + "%";
      el.textContent = items[i].letra;
      el.style.left = (50 + radio * Math.cos(ang)) + "%";
      el.style.top = (50 + radio * Math.sin(ang)) + "%";
      el.setAttribute("aria-label", "Letra " + items[i].letra);
      elRosco.appendChild(el);
      letrasEl.push(el);
    }
  }

  function pintarLetras() {
    for (var i = 0; i < items.length; i++) {
      var clase = "letra";
      if (items[i].estado !== "pendiente") clase += " " + items[i].estado;
      if (i === actual && jugando) clase += " actual";
      letrasEl[i].className = clase;
    }
  }

  function actualizarMarcador() {
    var ok = 0, mal = 0;
    items.forEach(function (it) {
      if (it.estado === "ok") ok++;
      if (it.estado === "mal") mal++;
    });
    elAciertos.textContent = ok;
    elErrores.textContent = mal;
  }

  function mostrarTiempo(seg) {
    elTiempo.textContent = seg;
    elTiempo.classList.toggle("poco", seg <= 15 && jugando);
  }

  // ---------- Flujo del juego ----------

  function reiniciarEstado() {
    items = PREGUNTAS.map(function (p) {
      return {
        letra: p.letra,
        tipo: p.tipo,
        pregunta: p.pregunta,
        respuesta: p.respuesta,
        alternativas: p.alternativas || [],
        estado: "pendiente" // pendiente | pasada | ok | mal
      };
    });
    actual = -1;
    jugando = false;
    clearInterval(timer);
    crearRosco();
    pintarLetras();
    actualizarMarcador();
    mostrarTiempo(TIEMPO);
    aviso("");
  }

  function buscarSiguiente(desde) {
    var n = items.length;
    for (var k = 1; k <= n; k++) {
      var i = (desde + k) % n;
      if (items[i].estado === "pendiente" || items[i].estado === "pasada") return i;
    }
    return -1;
  }

  function mostrarPregunta() {
    var it = items[actual];
    elTipo.textContent = (it.tipo === "contiene" ? "Contiene la " : "Con la ") + it.letra;
    elPregunta.textContent = it.pregunta;
    elInput.value = "";
    elInput.disabled = false;
    elInput.focus();
    pintarLetras();
  }

  function avanzar() {
    actualizarMarcador();
    var sig = buscarSiguiente(actual);
    if (sig === -1) {
      terminar("completo");
    } else {
      actual = sig;
      mostrarPregunta();
    }
  }

  function comenzar() {
    prepararAudio(); // se activa acá, con el toque en "Jugar"
    reiniciarEstado();
    jugando = true;
    mostrarPantalla("juego");
    var fin = Date.now() + TIEMPO * 1000;
    mostrarTiempo(TIEMPO);
    timer = setInterval(function () {
      var restante = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      mostrarTiempo(restante);
      if (restante <= 0) terminar("tiempo");
    }, 250);
    actual = buscarSiguiente(-1);
    mostrarPregunta();
  }

  function responder(texto) {
    if (!jugando) return;
    var t = normalizar(texto);
    if (t === "") {
      aviso("Escribí una respuesta o tocá Pasapalabra.", "info");
      return;
    }
    if (t === "pasapalabra") {
      pasar();
      return;
    }
    var it = items[actual];
    var validas = [it.respuesta].concat(it.alternativas).map(normalizar);
    if (validas.indexOf(t) !== -1) {
      it.estado = "ok";
      aviso("¡Correcto!", "ok");
      sonar("acierto");
    } else {
      it.estado = "mal";
      aviso("Incorrecto", "mal");
      sonar("error");
    }
    avanzar();
  }

  function pasar() {
    if (!jugando) return;
    items[actual].estado = "pasada";
    aviso("Pasapalabra…", "info");
    sonar("pasapalabra");
    avanzar();
  }

  function terminar(motivo) {
    jugando = false;
    clearInterval(timer);
    elTiempo.classList.remove("poco");
    elInput.disabled = true;
    pintarLetras();
    actualizarMarcador();

    var ok = 0, mal = 0, sin = 0;
    items.forEach(function (it) {
      if (it.estado === "ok") ok++;
      else if (it.estado === "mal") mal++;
      else sin++;
    });

    var titulo;
    if (ok === items.length) titulo = "¡Rosco perfecto! 🎉";
    else if (motivo === "tiempo") titulo = "¡Se acabó el tiempo!";
    else titulo = "¡Terminaste el rosco!";
    $("fin-titulo").textContent = titulo;
    $("fin-resumen").textContent =
      "Aciertos: " + ok + " de " + items.length + " · Errores: " + mal + " · Sin responder: " + sin + ".";

    var lista = $("fin-lista");
    lista.innerHTML = "";
    items.forEach(function (it) {
      var li = document.createElement("li");
      li.className = it.estado;
      var l = document.createElement("span");
      l.className = "l";
      l.textContent = it.letra;
      var r = document.createElement("span");
      r.textContent = it.respuesta;
      var e = document.createElement("span");
      e.className = "estado";
      e.textContent = it.estado === "ok" ? "Acertada" : it.estado === "mal" ? "Errada" : "Sin responder";
      li.appendChild(l);
      li.appendChild(r);
      li.appendChild(e);
      lista.appendChild(li);
    });
    mostrarPantalla("fin");
  }

  function volverAlInicio() {
    reiniciarEstado();
    mostrarPantalla("inicio");
  }

  // ---------- Arranque ----------

  function iniciar() {
    document.title = TITULO;
    $("titulo").textContent = TITULO;

    mostrarBotonSonido();
    $("btn-sonido").addEventListener("click", alternarSonido);

    if (typeof PREGUNTAS === "undefined" || !PREGUNTAS.length) {
      $("texto-inicio").textContent = "No hay preguntas cargadas. Revisá el archivo preguntas.js.";
      $("btn-jugar").disabled = true;
      return;
    }

    $("texto-inicio").textContent =
      "Respondé la definición de cada letra. Si no la sabés, tocá Pasapalabra y volvés más tarde. " +
      "Tenés " + TIEMPO + " segundos para completar las " + PREGUNTAS.length + " letras.";

    reiniciarEstado();
    mostrarPantalla("inicio");

    $("btn-jugar").addEventListener("click", comenzar);
    $("btn-pasar").addEventListener("click", pasar);
    $("btn-reiniciar").addEventListener("click", volverAlInicio);
    $("formulario").addEventListener("submit", function (ev) {
      ev.preventDefault();
      responder(elInput.value);
    });
  }

  iniciar();
})();
