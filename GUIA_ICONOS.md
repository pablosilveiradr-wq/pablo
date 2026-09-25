# Guía de iconos animados: píldoras de Pablo

Pegá este archivo al principio de cualquier chat nuevo, junto con el guion del video, y pedí:
**"Armame el storyboard de iconos para este guion usando la librería."**

---

## 1. Qué es la librería

200 iconos de línea, numerados del 001 al 200, cada uno exportado como clip animado propio.

| Dato | Valor |
|---|---|
| Formato | MP4 (H.264), **1080 × 1080 (1:1)**, 30 fps |
| Fondo | **Negro puro (#000)**, sin partículas ni nada flotando |
| Audio | **Ninguno**: la voz la pone Pablo en la edición |
| Duración de cada clip | 3 s (90 cuadros) |
| Nombre de archivo | `NNN_slug.mp4`, por ejemplo `061_herramienta.mp4` |
| Estilo | Línea blanca fina con un leve brillo; geometría de Lucide / Tabler, trazo uniforme en todos |

**Cómo se mueve cada clip (ágil):**
1. **0–0,3 s**: el icono entra con un pequeño rebote (escala de 55 % a 100 % con sobrepaso y un giro leve) y se va dibujando a mano, rápido.
2. **~0,3–0,7 s**: termina de dibujarse (los compuestos, un poco después). Justo ahí da un "golpe": destello de brillo y un pulso de escala.
3. **Hasta los 3 s**: queda flotando y respirando despacio. El editor corta donde quiera; si hace falta más tiempo, se congela el último cuadro o se alarga el clip.

---

## 2. Reglas para convertir un guion en iconos

1. **Un icono por frase corta**, de unos **1,3 a 1,6 s** cada uno. Las frases largas se cortan en dos o tres golpes, cada uno con su icono.
2. **Primero lo concreto:** si la frase nombra algo que se ve (café, cama, celular, pulmones), va ese icono. Si es abstracta, se usa la metáfora (ancla = calma, ola = emoción que sube y baja, nudo = tensión).
3. **Anáforas y repeticiones:** si el guion repite una estructura ("todavía estás a tiempo… todavía…"), se **repite el mismo icono** con progresión: por ejemplo el reloj de arena 081 → 099 → 082, o el ojo 080 (cerrado) → 160 (abierto).
4. **Contraste:** en los pares opuestos van los dos iconos del par: 041 / 042 (pecho apretado / cuerpo que se suelta), 052 / 053 (sin energía / con energía), 183 / 190 (bajón / subida), 021 / 029, 010 / 011.
5. **No repetir el mismo icono en golpes seguidos** salvo que sea una anáfora a propósito (regla 3).
6. **Cierre:** "Te veo en la próxima píldora" → **116 Saludo**.
7. **Datos y estudios:** "un estudio dice…" → 181; "la ciencia lo confirma" → 182; porcentajes → 192.
8. **Si no hay un icono que encaje bien, no forzar.** Se marca como **ICONO APARTE** con una descripción de lo que tiene que mostrar (ver sección 4).

### Formato de respuesta que tiene que devolver el chat

```
# | frase del guion                          | icono
1 | "Te doy una herramienta"                 | 061 Herramienta / llave
2 | "para cuando sentís ese nudo"            | 047 Nudo
3 | "en el pecho o el estómago"              | 041 Pecho apretado
4 | "Medí tres dedos desde el pliegue"       | ICONO APARTE: antebrazo con tres dedos marcados desde la muñeca
...
```

Si el guion trae tiempos (subtítulos o timecodes), se agrega la columna `entra (s)`.

---

## 3. Catálogo completo

Formato: **número · nombre**: qué se ve → cuándo usarlo.

### Mente (001–020)
- **001 · Pensamiento**: globo de pensamiento → "pensás que…", "se te cruza la idea".
- **002 · Suponer / imaginar**: persona con signo de pregunta → "te imaginás", "suponés lo peor".
- **003 · Sobrepensar**: cabeza con un espiral → darle vueltas, sobreanalizar.
- **004 · Pensamientos acelerados**: cabeza con viento → la mente va a mil.
- **005 · Preocupación en loop**: cabeza con flechas en círculo → la misma preocupación una y otra vez.
- **006 · Rumiar**: flechas circulares con un punto → volver siempre al mismo tema.
- **007 · Mente en otro lado**: cabeza con una nube → estar ausente, no estar presente.
- **008 · Mente en calma**: cabeza con una onda suave → mente tranquila, bajar un cambio.
- **009 · Callarse**: cara con la boca cerrada → tragarse las palabras, no decir nada.
- **010 · Niebla mental**: nube con niebla → confusión, no poder pensar claro.
- **011 · Mente despejada**: destellos → claridad, "se te aclara todo".
- **012 · Idea**: lamparita → idea, darse cuenta.
- **013 · Duda**: cara dudosa → no saber, indecisión.
- **014 · Pregunta**: globo de diálogo con signo de pregunta → "preguntate…", "¿y si…?".
- **015 · Foco**: marco de enfoque → centrarse, prestar atención.
- **016 · Distracción**: flechas cruzadas (aleatorio) → dispersarse, saltar de una cosa a otra.
- **017 · Crítica interna**: cabeza con globo de advertencia → la voz que te juzga.
- **018 · Etiqueta**: etiqueta → ponerle nombre a lo que sentís.
- **019 · Recuerdo**: reloj con flecha hacia atrás → acordarse, memoria.
- **020 · Decisión**: cartel con dos direcciones → elegir, dos caminos.

### Emociones (021–040)
- **021 · Tristeza**: cara triste.
- **022 · Corazón roto**: corazón partido → pérdida, desamor.
- **023 · Corazón en calma**: corazón simple → amor tranquilo, "tu corazón".
- **024 · Sostener el dolor**: mano que sostiene un corazón → acompañar lo que duele, cuidarse.
- **025 · Corazón protegido**: escudo con corazón → cuidarte, protegerte.
- **026 · Enojo**: cara enojada.
- **027 · Miedo**: cara nerviosa.
- **028 · Ansiedad**: corazón con un rayo → ansiedad, taquicardia emocional.
- **029 · Alegría**: cara feliz.
- **030 · Calma**: cara sonriente y serena.
- **031 · Culpa / carga**: pesa → cargar con algo, culpa.
- **032 · Vergüenza**: cara mirando para abajo.
- **033 · Soledad**: persona dentro de un círculo punteado → aislamiento, sentirse solo.
- **034 · Amor**: dos corazones.
- **035 · Esperanza**: vela encendida.
- **036 · Alivio**: nube con sol que asoma → "después se alivia".
- **037 · Agobio**: cabeza con flechas que la aprietan → sentirse desbordado.
- **038 · Vacío**: cara inexpresiva → apatía, no sentir nada.
- **039 · Gratitud**: corazón con destellos → agradecer.
- **040 · Compasión**: manos dándose con corazón → empatía, autocompasión.

### Cuerpo (041–060)
- **041 · Pecho apretado**: pulmones con flechas hacia adentro → opresión en el pecho.
- **042 · Cuerpo que se suelta**: pulmones con flechas hacia afuera → aflojar, soltar la tensión.
- **043 · Cuerpo en alerta**: sirena → modo alarma, lucha o huida.
- **044 · Herida**: curita → lastimadura, sanar.
- **045 · Presión**: manómetro → estrés alto, presión.
- **046 · Pies en la tierra**: huellas sobre una línea de suelo → grounding, estar anclado.
- **047 · Nudo**: lazo / cinta anudada → nudo en el pecho o el estómago.
- **048 · Latido**: corazón con pulso → latidos, corazón acelerado.
- **049 · Pulmones / respirar**: pulmones → respiración.
- **050 · Hombros tensos**: persona con rayos en los hombros → contractura, tensión.
- **051 · Dolor de cabeza**: cabeza con rayo.
- **052 · Sin energía**: batería baja → cansancio.
- **053 · Con energía**: batería llena → recargado.
- **054 · Dormir**: luna con "zzz".
- **055 · Insomnio**: ojo abierto con luna → no poder dormir.
- **056 · Tomar agua**: vaso de agua.
- **057 · Nervios / temblor**: línea de pulso → agitación.
- **058 · Calor / sofoco**: termómetro con sol.
- **059 · Sistema nervioso**: cerebro con circuitos → nervio vago, sistema nervioso.
- **060 · Punto de acupresión**: mano con un punto que pulsa → presionar un punto del cuerpo.

### Herramientas (061–080)
- **061 · Herramienta / llave**: llave → "te doy una herramienta", la clave.
- **062 · Pausa**: botón de pausa → frenar, hacer una pausa.
- **063 · Aquí y ahora**: pin de ubicación → estar presente, "acá".
- **064 · Ahora / este punto**: mira → este momento exacto.
- **065 · Lista / checklist**: lista con tildes → pasos, tareas hechas.
- **066 · Caminar**: huellas → salir a caminar.
- **067 · Respiración cuadrada**: cuadrado con un punto que lo recorre (4 lados = 4 tiempos) → box breathing.
- **068 · Inhalar y exhalar**: dos círculos concéntricos que se agrandan y achican → respirar hondo.
- **069 · 5 sentidos (5-4-3-2-1)**: ojo, oreja y mano → técnica de los 5 sentidos.
- **070 · Escaneo corporal**: persona dentro de un marco de escaneo → body scan.
- **071 · Escribir / diario**: cuaderno con lapicera → journaling.
- **072 · Meditar**: persona sentada meditando.
- **073 · Agua fría en la cara**: gotas → agua fría, reflejo de buceo.
- **074 · Contar**: marcas de conteo → contar hasta 5 / 10.
- **075 · Ancla**: ancla → anclarse, volver al centro.
- **076 · Temporizador**: cronómetro → "un minuto", poner un tiempo.
- **077 · Tararear / zumbido**: barras de audio → tararear, sonido, voz.
- **078 · Sacudir el cuerpo**: celular vibrando → sacudirse, vibrar, soltar.
- **079 · Modo avión**: avión → desconectarse.
- **080 · Cerrar los ojos**: ojo cerrado con pestañas.

### Tiempo (081–100)
- **081 · Reloj de arena**: arena arriba → "todavía hay tiempo".
- **082 · Se acaba el tiempo**: arena abajo.
- **083 · La mitad del día**: sol y luna → a mitad del día, día y noche.
- **084 · Línea de tiempo**: línea con puntos → proceso, historia.
- **085 · Alarma / despertador**: reloj despertador → despertarse, urgencia.
- **086 · Reloj**: reloj simple → la hora, el tiempo.
- **087 · Calendario**: calendario → días, fechas.
- **088 · Amanecer**: sol que sube con flecha → empezar el día, renacer.
- **089 · Noche**: luna con estrella.
- **090 · Pasado**: flecha que vuelve → lo que ya pasó.
- **091 · Futuro**: telescopio → mirar hacia adelante, anticiparse.
- **092 · Presente**: círculo con punto al centro → el ahora.
- **093 · Esperar**: indicador de carga → esperar, "dale tiempo".
- **094 · Apuro / prisa**: persona corriendo.
- **095 · Despacio**: caracol → ir lento, sin apuro.
- **096 · Ciclos**: flechas en círculo → patrones que se repiten.
- **097 · Hoy**: calendario con tilde → "hoy", día cumplido.
- **098 · Rebobinar**: rebobinar → volver atrás.
- **099 · Paciencia**: reloj de arena → paciencia (repetible con 081 / 082).
- **100 · Un momento / una foto**: cámara → un instante, capturar un momento.

### Vínculos (101–120)
- **101 · Vínculo / hilo**: eslabones de cadena → conexión con alguien.
- **102 · Gente**: dos personas → los demás, la gente.
- **103 · Llamar**: teléfono sonando → llamar a alguien.
- **104 · Decir que no**: señal de prohibido → poner un no, negarse.
- **105 · Videollamada**: cámara de video.
- **106 · Dos personas**: pareja de siluetas → vos y el otro.
- **107 · Abrazo**: dos personas con un corazón.
- **108 · Conversación**: dos globos de diálogo → hablar, charlar.
- **109 · Discusión**: espadas cruzadas → pelea, conflicto.
- **110 · Distancia**: dos personas con flecha doble → alejarse, separación.
- **111 · Puente**: puente → acercarse, tender un puente.
- **112 · Límite**: cerco → poner límites.
- **113 · Rechazo**: persona con una cruz.
- **114 · Escuchar**: oreja.
- **115 · Familia**: grupo de personas.
- **116 · Saludo / te veo en la próxima**: mano abierta → cierre de todos los videos.
- **117 · Mensaje / una palabra**: globo con texto → un mensaje, lo que te dijeron.
- **118 · Comparación**: balanza → compararte con otros, equilibrio.
- **119 · Apoyo**: mano que ayuda → sostener, dar una mano.
- **120 · Reconexión**: eslabón unido → volver a conectar.

### Naturaleza (121–140)
- **121 · Ola**: olas → emoción que sube y baja.
- **122 · Tormenta**: nube con rayo → crisis, momento difícil.
- **123 · Lluvia**: nube con lluvia → tristeza, días grises.
- **124 · Sol**: sol → bienestar, claridad.
- **125 · Semilla**: semilla → el comienzo de algo.
- **126 · Brote / empezar**: brote con hojas → crecer, empezar.
- **127 · Árbol con raíces**: árbol → estabilidad, crecer firme.
- **128 · Montaña**: montaña → desafío, algo grande.
- **129 · Río**: ondas de agua → fluir, dejar pasar.
- **130 · Piedra**: piedra → peso, obstáculo, algo que no se mueve.
- **131 · Hoja que cae**: hoja → soltar, dejar ir.
- **132 · Flor**: flor → florecer, cuidarse.
- **133 · Luna**: luna creciente → calma, noche.
- **134 · Fuego**: llama → enojo, pasión, energía.
- **135 · Hielo que se derrite**: copo de nieve → congelarse, bloqueo.
- **136 · Viento**: líneas de viento → cambio, algo que pasa.
- **137 · Horizonte**: sol que baja → cierre, final del día.
- **138 · Camino**: ruta con curvas → el proceso, el recorrido.
- **139 · Faro**: faro con luz → guía, orientación.
- **140 · Iceberg**: iceberg sobre la línea del agua → lo que no se ve.

### Cambio (141–160)
- **141 · Escalera / lo que costó**: escalones con flecha arriba → progreso paso a paso.
- **142 · Podio / un escalón**: podio de tres → logro, avanzar un escalón.
- **143 · A medio terminar**: círculo incompleto → proceso en curso.
- **144 · Ya pasó (pero sigue)**: círculo con tilde → superado, hecho.
- **145 · Puerta abierta**: puerta → oportunidad, salida.
- **146 · Candado abierto**: candado abierto → liberarse, desbloquear.
- **147 · Rompecabezas**: pieza de rompecabezas → encajar, entender.
- **148 · Mariposa**: mariposa → transformación.
- **149 · Meta / bandera**: bandera → objetivo cumplido, llegada.
- **150 · Objetivo**: diana → apuntar a algo.
- **151 · Brújula**: brújula → rumbo, dirección.
- **152 · Jaula abierta**: pájaro → libertad, volar.
- **153 · Cadena rota**: eslabón cortado → cortar un vínculo o un patrón.
- **154 · Soltar peso**: pluma → liviandad, soltar carga.
- **155 · Página nueva**: hoja con signo + → empezar de cero.
- **156 · Progreso**: barras que crecen → mejorar de a poco.
- **157 · Cima**: montaña con bandera → llegar, lograrlo.
- **158 · Primer paso**: persona caminando → dar el primer paso.
- **159 · Empezar de nuevo**: flecha que gira → reintentar, volver a arrancar.
- **160 · Abrir los ojos / verlo**: ojo abierto → darse cuenta, ver claro.

### Vida diaria (161–180)
- **161 · Redes / celular**: celular.
- **162 · Foto en redes**: imagen / foto.
- **163 · Video**: botón de play.
- **164 · Levantarse sin ganas**: cama con batería baja.
- **165 · Comer**: tazón humeante.
- **166 · Pendientes en la cama**: cama con lista → pensar en pendientes antes de dormir.
- **167 · Alcohol**: copa de vino.
- **168 · Pendientes**: lista de tareas.
- **169 · Notificación**: campana sonando.
- **170 · Trabajo / computadora**: notebook.
- **171 · Café**: taza de café.
- **172 · Casa**: casa.
- **173 · Dinero**: billete.
- **174 · Tráfico / auto**: auto.
- **175 · Likes**: pulgar arriba.
- **176 · Auriculares**: auriculares → música, escuchar algo.
- **177 · Libro**: libro abierto → leer.
- **178 · Ducha**: ducha.
- **179 · Ventana**: ventana → mirar afuera, perspectiva.
- **180 · Silla vacía**: sillón vacío → ausencia, alguien que falta.

### Ciencia (181–200)
- **181 · Estudio científico**: documento con gráfico → "un estudio de…".
- **182 · La ciencia lo confirma**: átomo.
- **183 · Bajón / gráfico en caída**: flecha en zigzag hacia abajo.
- **184 · Investigar**: documento con lupa.
- **185 · Dos flechas**: diana con dos flechas → parábola de la segunda flecha (el dolor y el sufrimiento que le agregamos).
- **186 · La primera flecha**: diana con una flecha → el dolor inevitable.
- **187 · Cerebro**: cerebro.
- **188 · Neurona**: nodos conectados → neuronas, conexiones.
- **189 · Alarma cerebral (amígdala)**: cerebro con triángulo de alerta.
- **190 · Gráfico en subida**: flecha en zigzag hacia arriba.
- **191 · Lupa**: lupa → mirar de cerca, analizar.
- **192 · Estadística**: gráfico de torta → porcentajes, datos.
- **193 · Molécula**: nodos (compartir) → química, hormonas.
- **194 · ADN**: doble hélice → genética, "está en tu naturaleza".
- **195 · Ondas cerebrales**: onda → actividad cerebral, frecuencia.
- **196 · Microscopio**: microscopio → estudiar, laboratorio.
- **197 · Experimento**: matraz → prueba, experimento.
- **198 · Universidad**: birrete → universidad, académico.
- **199 · Maestro**: pizarra de presentación → enseñar, clase.
- **200 · Le preguntaron a un maestro**: persona meditando con signo de pregunta → anécdotas tipo "le preguntaron a un maestro zen…".

---

## 4. Iconos aparte (a medida para un video)

Cuando una frase necesita algo muy específico (un gesto del cuerpo, un objeto puntual, una secuencia), se pide **aparte**. Reglas de estilo para que combine con la librería:

- Misma línea blanca fina, sin rellenos, puntas redondeadas, leve brillo.
- **Todas las líneas tienen que conectar exactamente**: nada de cabezas flotando, pestañas despegadas ni trazos que no se tocan.
- **Manos sin dedos dibujados** (salvo las de la librería, que vienen de sets profesionales).
- Geometría simple, tipo ícono, nada de ilustración detallada.
- Si una misma escena avanza (por ejemplo el brazo: marcar los tres dedos → los tendones → presionar), se arma como **escena compartida**: el dibujo base queda y en cada golpe se suma una capa nueva.
- Misma animación de entrada que la librería: rebote, trazado rápido y destello al terminar.

Cómo pedirlo: `ICONO APARTE: <qué se ve> — <qué frase acompaña> — <si es parte de una escena que continúa>`.

---

## 5. Notas técnicas (para sesiones de Claude Code en el repo)

- Repositorio `pablosilveiradr-wq/pablo`; proyecto Remotion.
- Catálogo: `src/Anim/library/catalog.ts` (el orden define la numeración). Los glifos vienen de `src/Anim/library/vendor/{lucide,tabler,house}/*.svg`, y `python3 scripts/import_icons.py build` los convierte a `vendor.ts`.
- Centrado y tamaño automáticos: `python3 scripts/library.py fit`. Hojas de aprobación: `python3 scripts/library.py sheets <carpeta> [a-b]`.
- Clip de un icono: composición `LibraryClip` (prop `id`); todos juntos: `LibraryReel` (prop `ids`), 90 cuadros por icono, en orden.
- Storyboard de un video: composición `Storyboard` con `beats: [{icon, seconds, scene?}]` y `scale: 0.88`; `icon` puede ser un slug de la librería (`"herramienta"`) o cualquier glifo importado (`"v:lucide/key-round"`).
- Render: `npx remotion bundle` y después `npx remotion render build <Composición> out/x.mp4 --props=props.json --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
- Preferencias fijas: 1:1, iconos a escala 0.88, fondo negro puro, sin partículas, sin audio.
