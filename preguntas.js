/* ============================================================
   PREGUNTAS DEL ROSCO — Educación Física (Provincia de Buenos Aires)
   Acá podés cambiar todo sin tocar el resto del código.

   Cada entrada tiene:
     letra         → la letra del rosco (en mayúscula)
     tipo          → "empieza" (Con la A...) o "contiene" (Contiene la A...)
     pregunta      → la definición que se muestra
     respuesta     → la respuesta correcta
     alternativas  → (opcional) otras formas de escribirla que también valen

   No hace falta que sean 25 letras: el rosco se arma solo con
   las entradas que haya en la lista. Las tildes y las mayúsculas
   no importan al responder ("futbol" vale igual que "Fútbol").
   ============================================================ */

const CONFIG = {
  titulo: "Rosco de Educación Física",
  tiempo: 150 // segundos que dura la partida
};

const PREGUNTAS = [
  { letra: "A", tipo: "empieza", pregunta: "Deporte que reúne carreras, saltos y lanzamientos; se lo considera la base de muchos otros deportes.", respuesta: "Atletismo" },
  { letra: "B", tipo: "empieza", pregunta: "Deporte en el que la \"Generación Dorada\" ganó la medalla de oro olímpica en Atenas 2004.", respuesta: "Básquet", alternativas: ["Básquetbol", "Baloncesto"] },
  { letra: "C", tipo: "empieza", pregunta: "Parte inicial de la clase que prepara el cuerpo para el esfuerzo y ayuda a prevenir lesiones.", respuesta: "Calentamiento", alternativas: ["Entrada en calor"] },
  { letra: "D", tipo: "empieza", pregunta: "Documento oficial de la Dirección General de Cultura y Educación bonaerense que define qué se enseña en cada materia y año.", respuesta: "Diseño curricular" },
  { letra: "E", tipo: "empieza", pregunta: "Capacidad coordinativa que permite mantener el cuerpo estable, por ejemplo al caminar sobre un banco o pararse en un solo pie.", respuesta: "Equilibrio" },
  { letra: "F", tipo: "empieza", pregunta: "Deporte más popular del país: la selección argentina fue campeona del mundo en 1978, 1986 y 2022.", respuesta: "Fútbol" },
  { letra: "G", tipo: "empieza", pregunta: "Práctica corporal con aparatos como paralelas, anillas y caballo con arcos; en la escuela se enseña con giros, saltos y volteretas.", respuesta: "Gimnasia", alternativas: ["Gimnasia artística"] },
  { letra: "H", tipo: "empieza", pregunta: "Deporte de equipo que se juega con las manos y busca lanzar la pelota al arco; cada equipo tiene seis jugadores de campo y un arquero.", respuesta: "Handball", alternativas: ["Handbol", "Balonmano"] },
  { letra: "I", tipo: "empieza", pregunta: "Principio de la educación física escolar que busca que todos los estudiantes participen y aprendan, sin que nadie quede afuera.", respuesta: "Inclusión" },
  { letra: "J", tipo: "empieza", pregunta: "Evento deportivo y cultural de la Provincia de Buenos Aires con tres etapas: municipal, regional y final provincial.", respuesta: "Juegos Bonaerenses", alternativas: ["Los Juegos Bonaerenses"] },
  { letra: "K", tipo: "empieza", pregunta: "Arte marcial japonesa de combate sin armas, con golpes de puño, patadas y bloqueos; fue deporte olímpico en Tokio 2020.", respuesta: "Karate", alternativas: ["Karate-do", "Kárate"] },
  { letra: "L", tipo: "empieza", pregunta: "Predominio de un lado del cuerpo, derecho o izquierdo, al usar las manos, los pies y los ojos.", respuesta: "Lateralidad" },
  { letra: "M", tipo: "empieza", pregunta: "Ciudad de la costa bonaerense, apodada \"La Feliz\", que fue sede de los Juegos Panamericanos de 1995.", respuesta: "Mar del Plata", alternativas: ["Mardel"] },
  { letra: "N", tipo: "empieza", pregunta: "Deporte acuático con cuatro estilos: crol, espalda, pecho y mariposa.", respuesta: "Natación" },
  { letra: "Ñ", tipo: "contiene", pregunta: "Tarea central del docente: guiar a los alumnos y transmitirles saberes para que puedan aprender.", respuesta: "Enseñanza" },
  { letra: "O", tipo: "empieza", pregunta: "Deporte en el que se recorre un terreno desconocido con mapa y brújula, pasando por distintos controles; se practica mucho en los campamentos.", respuesta: "Orientación", alternativas: ["Orienteering"] },
  { letra: "P", tipo: "empieza", pregunta: "Latidos del corazón por minuto, que se pueden tomar en la muñeca o el cuello para controlar la intensidad del esfuerzo.", respuesta: "Pulsaciones", alternativas: ["Pulso", "Frecuencia cardíaca"] },
  { letra: "Q", tipo: "empieza", pregunta: "Juego escolar muy popular en Argentina, en el que se lanza una pelota para tocar a los rivales y eliminarlos hasta que no quede ninguno en pie.", respuesta: "Quemado", alternativas: ["Quemada", "El quemado", "Juego del quemado"] },
  { letra: "R", tipo: "empieza", pregunta: "Deporte de pelota ovalada cuya selección masculina argentina es conocida como Los Pumas.", respuesta: "Rugby", alternativas: ["Rugbi"] },
  { letra: "S", tipo: "empieza", pregunta: "Falta de actividad física habitual, un hábito que la educación física escolar busca prevenir.", respuesta: "Sedentarismo" },
  { letra: "T", tipo: "empieza", pregunta: "Deporte de paletas que se juega sobre una mesa dividida por una red, con una pelota muy liviana y rápida.", respuesta: "Tenis de mesa", alternativas: ["Ping pong", "Pingpong"] },
  { letra: "U", tipo: "empieza", pregunta: "Planificación de varias clases sobre un mismo contenido, con objetivos, actividades y evaluación.", respuesta: "Unidad didáctica" },
  { letra: "V", tipo: "empieza", pregunta: "Deporte de red con equipos de seis jugadores; la selección argentina masculina ganó el bronce olímpico en Seúl 1988 y en Tokio 2020.", respuesta: "Vóley", alternativas: ["Voleibol", "Vóleibol"] },
  { letra: "W", tipo: "empieza", pregunta: "Deporte acuático de equipo que se juega en una pileta, con arcos, y en el que los jugadores se mantienen a flote sin apoyarse en el fondo.", respuesta: "Waterpolo", alternativas: ["Water polo", "Water-polo", "Polo acuático"] },
  { letra: "X", tipo: "contiene", pregunta: "Capacidad física que permite mover las articulaciones con gran amplitud.", respuesta: "Flexibilidad" },
  { letra: "Y", tipo: "empieza", pregunta: "Práctica de origen indio que combina posturas, respiración y relajación; se puede usar en la vuelta a la calma.", respuesta: "Yoga" },
  { letra: "Z", tipo: "empieza", pregunta: "Paso largo hacia adelante con flexión de rodilla, usado al correr y como ejercicio de fuerza para las piernas.", respuesta: "Zancada", alternativas: ["Zancadas", "Estocada", "Estocadas"] }
];
