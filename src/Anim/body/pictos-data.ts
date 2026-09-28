/** Written by scripts/body_icons.py — regenerate rather than edit. */
export type BodyPicto = {
  readonly id: string;
  readonly name: string;
  readonly cat: string;
  /** Glyph key in the vendored icon set. */
  readonly key: string;
  /** Landmarks in 24-grid units. */
  readonly points: Readonly<Record<string, readonly [number, number]>>;
};

export const BODY_PICTOS: readonly BodyPicto[] = [
 {
  "id": "cabeza-frente",
  "name": "Cabeza de frente",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-cabeza-frente",
  "points": {
   "coronilla": [
    12,
    3.8
   ],
   "frente": [
    12,
    5.6
   ],
   "entrecejo": [
    12,
    7.6
   ],
   "sien-izquierda": [
    8,
    7.6
   ],
   "sien-derecha": [
    16,
    7.6
   ],
   "mejilla-derecha": [
    14.6,
    9.6
   ],
   "debajo-nariz": [
    12,
    10.4
   ],
   "menton": [
    12,
    12.6
   ],
   "mandibula-derecha": [
    15.6,
    11.2
   ],
   "delante-oreja-derecha": [
    16.4,
    8.8
   ],
   "cuello-derecho": [
    13.8,
    14.4
   ],
   "clavicula-derecha": [
    15,
    17.2
   ],
   "pecho": [
    12,
    19
   ]
  }
 },
 {
  "id": "cara",
  "name": "Cara (primer plano)",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-cara",
  "points": {
   "coronilla": [
    12,
    4
   ],
   "frente": [
    12,
    6.6
   ],
   "entrecejo": [
    12,
    9.6
   ],
   "sien-izquierda": [
    5.6,
    9.4
   ],
   "sien-derecha": [
    18.4,
    9.4
   ],
   "debajo-ojo-izquierdo": [
    9,
    12.2
   ],
   "debajo-ojo-derecho": [
    15,
    12.2
   ],
   "pomulo-derecho": [
    16.4,
    13.4
   ],
   "debajo-nariz": [
    12,
    15
   ],
   "menton": [
    12,
    19
   ],
   "mandibula-derecha": [
    17.2,
    16.6
   ],
   "delante-oreja-derecha": [
    19.4,
    12
   ]
  }
 },
 {
  "id": "cabeza-perfil",
  "name": "Cabeza de perfil",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-cabeza-perfil",
  "points": {
   "coronilla": [
    12,
    3.2
   ],
   "frente": [
    16.2,
    5
   ],
   "sien": [
    15,
    7.4
   ],
   "delante-oreja": [
    12.6,
    9
   ],
   "detras-oreja": [
    9.4,
    9
   ],
   "base-craneo": [
    8.6,
    12.4
   ],
   "nuca": [
    9.6,
    14.6
   ],
   "mandibula": [
    14.8,
    12
   ]
  }
 },
 {
  "id": "cabeza-atras",
  "name": "Cabeza de atrás / nuca",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-cabeza-atras",
  "points": {
   "coronilla": [
    12,
    3.8
   ],
   "base-craneo-izquierda": [
    10.4,
    12.4
   ],
   "base-craneo-derecha": [
    13.6,
    12.4
   ],
   "nuca": [
    12,
    14.4
   ],
   "trapecio-izquierdo": [
    7.6,
    17.4
   ],
   "trapecio-derecho": [
    16.4,
    17.4
   ],
   "entre-omoplatos": [
    12,
    20.4
   ]
  }
 },
 {
  "id": "coronilla",
  "name": "Coronilla (desde arriba)",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-coronilla",
  "points": {
   "coronilla": [
    12,
    12.5
   ],
   "frente": [
    12,
    7.6
   ],
   "nuca": [
    12,
    17.6
   ]
  }
 },
 {
  "id": "oreja",
  "name": "Oreja",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-oreja",
  "points": {
   "lobulo": [
    13.5,
    20.4
   ],
   "punta-oreja": [
    10.5,
    2.4
   ],
   "borde-oreja": [
    4.2,
    9
   ],
   "concha": [
    11.6,
    11.6
   ],
   "fosa-triangular": [
    9.4,
    6.4
   ],
   "trago": [
    16.4,
    12.6
   ]
  }
 },
 {
  "id": "ojos",
  "name": "Ojos y cejas",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-ojos",
  "points": {
   "entrecejo": [
    12,
    8.6
   ],
   "ceja-izquierda": [
    6.5,
    7.6
   ],
   "ceja-derecha": [
    17.5,
    7.6
   ],
   "debajo-ojo-izquierdo": [
    6.5,
    15.4
   ],
   "debajo-ojo-derecho": [
    17.5,
    15.4
   ],
   "lagrimal-izquierdo": [
    10.6,
    12.4
   ],
   "lagrimal-derecho": [
    13.4,
    12.4
   ]
  }
 },
 {
  "id": "ojo-cerrado",
  "name": "Ojo cerrado",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-ojo-cerrado",
  "points": {
   "parpado": [
    12,
    13.6
   ],
   "sien": [
    21.4,
    10.6
   ],
   "lagrimal": [
    3.6,
    11.6
   ]
  }
 },
 {
  "id": "nariz",
  "name": "Nariz",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-nariz",
  "points": {
   "punta-nariz": [
    12,
    16.2
   ],
   "costado-nariz-izquierdo": [
    8.4,
    15.6
   ],
   "costado-nariz-derecho": [
    15.6,
    15.6
   ],
   "puente": [
    12,
    5.6
   ],
   "debajo-nariz": [
    12,
    19.4
   ]
  }
 },
 {
  "id": "boca",
  "name": "Boca / labios",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-boca",
  "points": {
   "comisura-izquierda": [
    3,
    12
   ],
   "comisura-derecha": [
    21,
    12
   ],
   "labio-superior": [
    12,
    9.4
   ],
   "debajo-labio": [
    12,
    18.6
   ]
  }
 },
 {
  "id": "cuello",
  "name": "Cuello y clavículas",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-cuello",
  "points": {
   "garganta": [
    12,
    9
   ],
   "hueco-clavicula": [
    12,
    14
   ],
   "debajo-clavicula-izquierda": [
    7,
    16.6
   ],
   "debajo-clavicula-derecha": [
    17,
    16.6
   ],
   "cuello-costado-derecho": [
    14.5,
    8.6
   ]
  }
 },
 {
  "id": "hombros-atras",
  "name": "Hombros y trapecio (atrás)",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-hombros-atras",
  "points": {
   "trapecio-izquierdo": [
    6.4,
    10
   ],
   "trapecio-derecho": [
    17.6,
    10
   ],
   "base-cuello": [
    12,
    8.6
   ],
   "entre-omoplatos": [
    12,
    14.6
   ],
   "hombro-derecho": [
    20.8,
    13.6
   ]
  }
 },
 {
  "id": "cabeza-inclinada",
  "name": "Cabeza inclinada (estirar el cuello)",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-cabeza-inclinada",
  "points": {
   "cuello-costado-izquierdo": [
    10,
    13.4
   ],
   "trapecio-izquierdo": [
    7,
    17.2
   ],
   "sien-derecha": [
    18.4,
    6.6
   ]
  }
 },
 {
  "id": "mano-en-la-frente",
  "name": "Mano en la frente",
  "cat": "Cabeza y cuello",
  "key": "house/cuerpo-mano-en-la-frente",
  "points": {
   "frente": [
    12,
    6.6
   ],
   "entrecejo": [
    12,
    9.4
   ]
  }
 },
 {
  "id": "torso-frente",
  "name": "Torso de frente",
  "cat": "Torso",
  "key": "house/cuerpo-torso-frente",
  "points": {
   "hueco-clavicula": [
    12,
    5.8
   ],
   "debajo-clavicula-derecha": [
    15.4,
    7.2
   ],
   "esternon": [
    12,
    9.4
   ],
   "boca-estomago": [
    12,
    12.6
   ],
   "ombligo": [
    12,
    16.4
   ],
   "bajo-vientre": [
    12,
    19.6
   ],
   "costado-derecho": [
    17.6,
    13.4
   ]
  }
 },
 {
  "id": "espalda",
  "name": "Espalda",
  "cat": "Torso",
  "key": "house/cuerpo-espalda",
  "points": {
   "entre-omoplatos": [
    12,
    9
   ],
   "omoplato-derecho": [
    15.4,
    8.6
   ],
   "media-espalda": [
    12,
    13
   ],
   "lumbar": [
    12,
    17.8
   ],
   "cintura-derecha": [
    16.4,
    16.4
   ]
  }
 },
 {
  "id": "pecho",
  "name": "Pecho",
  "cat": "Torso",
  "key": "house/cuerpo-pecho",
  "points": {
   "esternon": [
    12,
    10
   ],
   "pecho-izquierdo": [
    8,
    9.6
   ],
   "pecho-derecho": [
    16,
    9.6
   ],
   "debajo-clavicula-derecha": [
    16,
    5.8
   ]
  }
 },
 {
  "id": "panza",
  "name": "Panza / abdomen",
  "cat": "Torso",
  "key": "house/cuerpo-panza",
  "points": {
   "ombligo": [
    12,
    12
   ],
   "boca-estomago": [
    12,
    6
   ],
   "bajo-vientre": [
    12,
    16.4
   ],
   "costado-derecho": [
    18.4,
    9
   ]
  }
 },
 {
  "id": "costillas",
  "name": "Costillas",
  "cat": "Torso",
  "key": "house/cuerpo-costillas",
  "points": {
   "esternon": [
    12,
    8
   ],
   "costillas-derechas": [
    16.4,
    11.6
   ],
   "costillas-izquierdas": [
    7.6,
    11.6
   ],
   "debajo-costillas": [
    12,
    15.4
   ]
  }
 },
 {
  "id": "columna",
  "name": "Columna",
  "cat": "Torso",
  "key": "house/cuerpo-columna",
  "points": {
   "cervical": [
    12,
    3.8
   ],
   "dorsal": [
    12,
    9.8
   ],
   "lumbar": [
    12,
    15.2
   ],
   "sacro": [
    12,
    19
   ]
  }
 },
 {
  "id": "espalda-baja",
  "name": "Espalda baja / lumbar",
  "cat": "Torso",
  "key": "house/cuerpo-espalda-baja",
  "points": {
   "lumbar": [
    12,
    10
   ],
   "sacro": [
    12,
    16.6
   ],
   "rinon-derecho": [
    15.6,
    7.6
   ],
   "rinon-izquierdo": [
    8.4,
    7.6
   ],
   "cadera-derecha": [
    18,
    14
   ]
  }
 },
 {
  "id": "omoplatos",
  "name": "Omóplatos",
  "cat": "Torso",
  "key": "house/cuerpo-omoplatos",
  "points": {
   "entre-omoplatos": [
    12,
    9.6
   ],
   "omoplato-izquierdo": [
    7.6,
    9
   ],
   "omoplato-derecho": [
    16.4,
    9
   ],
   "debajo-omoplato": [
    12,
    16.4
   ]
  }
 },
 {
  "id": "clavicula",
  "name": "Clavículas",
  "cat": "Torso",
  "key": "house/cuerpo-clavicula",
  "points": {
   "hueco-clavicula": [
    12,
    10.6
   ],
   "debajo-clavicula-izquierda": [
    6.6,
    13
   ],
   "debajo-clavicula-derecha": [
    17.4,
    13
   ],
   "clavicula-derecha": [
    17.4,
    9.8
   ]
  }
 },
 {
  "id": "cadera",
  "name": "Cadera / pelvis",
  "cat": "Torso",
  "key": "house/cuerpo-cadera",
  "points": {
   "cadera-derecha": [
    18.4,
    8
   ],
   "cadera-izquierda": [
    5.6,
    8
   ],
   "centro-pelvis": [
    12,
    11
   ],
   "ingle-derecha": [
    15.5,
    17.6
   ]
  }
 },
 {
  "id": "diafragma",
  "name": "Diafragma",
  "cat": "Torso",
  "key": "house/cuerpo-diafragma",
  "points": {
   "diafragma": [
    12,
    10.6
   ],
   "boca-estomago": [
    12,
    12.6
   ],
   "costado-derecho": [
    17.6,
    12.4
   ]
  }
 },
 {
  "id": "estomago",
  "name": "Estómago",
  "cat": "Torso",
  "key": "house/cuerpo-estomago",
  "points": {
   "estomago": [
    9.6,
    14.6
   ],
   "boca-estomago": [
    11,
    9.4
   ]
  }
 },
 {
  "id": "pulmones",
  "name": "Pulmones",
  "cat": "Torso",
  "key": "house/cuerpo-pulmones",
  "points": {
   "pulmon-izquierdo": [
    7,
    14
   ],
   "pulmon-derecho": [
    17,
    14
   ],
   "centro-pecho": [
    12,
    9
   ]
  }
 },
 {
  "id": "corazon",
  "name": "Corazón",
  "cat": "Torso",
  "key": "house/cuerpo-corazon",
  "points": {
   "corazon": [
    12,
    11
   ]
  }
 },
 {
  "id": "brazo",
  "name": "Brazo",
  "cat": "Brazos",
  "key": "house/cuerpo-brazo",
  "points": {
   "hombro": [
    12,
    2.6
   ],
   "biceps": [
    12,
    6.5
   ],
   "codo": [
    12,
    11.3
   ],
   "antebrazo": [
    12,
    15.6
   ],
   "muneca": [
    12,
    19.6
   ]
  }
 },
 {
  "id": "brazo-doblado",
  "name": "Brazo doblado",
  "cat": "Brazos",
  "key": "house/cuerpo-brazo-doblado",
  "points": {
   "hombro": [
    8,
    3.6
   ],
   "biceps": [
    8,
    8
   ],
   "codo": [
    8,
    14.4
   ],
   "antebrazo": [
    14,
    15
   ],
   "muneca": [
    18.4,
    15
   ]
  }
 },
 {
  "id": "codo",
  "name": "Codo",
  "cat": "Brazos",
  "key": "house/cuerpo-codo",
  "points": {
   "codo-punta": [
    8,
    13.4
   ],
   "codo-pliegue": [
    10.6,
    11.6
   ],
   "biceps": [
    8,
    6
   ],
   "antebrazo": [
    15.8,
    13.4
   ]
  }
 },
 {
  "id": "antebrazo-interno",
  "name": "Antebrazo interno",
  "cat": "Brazos",
  "key": "house/cuerpo-antebrazo-interno",
  "points": {
   "centro-palma": [
    12,
    5.6
   ],
   "muneca-centro": [
    12,
    9
   ],
   "muneca-menique": [
    9.6,
    9
   ],
   "muneca-pulgar": [
    14.4,
    9
   ],
   "tres-dedos": [
    12,
    12.6
   ],
   "antebrazo-medio": [
    12,
    16.4
   ],
   "codo-pliegue": [
    12,
    21.4
   ]
  }
 },
 {
  "id": "antebrazo-externo",
  "name": "Antebrazo externo",
  "cat": "Brazos",
  "key": "house/cuerpo-antebrazo-externo",
  "points": {
   "dorso-mano": [
    12,
    5.6
   ],
   "muneca-dorso": [
    12,
    9
   ],
   "tres-dedos-dorso": [
    12,
    12.6
   ],
   "antebrazo-medio": [
    12,
    16.4
   ],
   "codo": [
    12,
    21.4
   ]
  }
 },
 {
  "id": "muneca",
  "name": "Muñeca",
  "cat": "Brazos",
  "key": "house/cuerpo-muneca",
  "points": {
   "muneca-centro": [
    12,
    12.6
   ],
   "muneca-menique": [
    8.6,
    12.6
   ],
   "muneca-pulgar": [
    15.4,
    12.6
   ],
   "entre-tendones": [
    12,
    17
   ],
   "centro-palma": [
    12,
    7
   ]
  }
 },
 {
  "id": "hombros",
  "name": "Hombros",
  "cat": "Brazos",
  "key": "house/cuerpo-hombros",
  "points": {
   "hombro-izquierdo": [
    5,
    10.4
   ],
   "hombro-derecho": [
    19,
    10.4
   ],
   "trapecio-derecho": [
    16,
    7.9
   ],
   "base-cuello": [
    12,
    7
   ]
  }
 },
 {
  "id": "axila",
  "name": "Axila / costado (brazo arriba)",
  "cat": "Brazos",
  "key": "house/cuerpo-axila",
  "points": {
   "axila": [
    14.4,
    7.4
   ],
   "costado-derecho": [
    14.2,
    11
   ],
   "brazo-arriba": [
    17.2,
    3
   ]
  }
 },
 {
  "id": "brazo-extendido",
  "name": "Brazo extendido",
  "cat": "Brazos",
  "key": "house/cuerpo-brazo-extendido",
  "points": {
   "hombro": [
    3,
    12
   ],
   "biceps": [
    8,
    12
   ],
   "codo": [
    12.8,
    12
   ],
   "antebrazo": [
    16.4,
    12
   ],
   "muneca": [
    19.6,
    12
   ]
  }
 },
 {
  "id": "mano-palma",
  "name": "Palma de la mano",
  "cat": "Manos",
  "key": "house/cuerpo-mano-palma",
  "points": {
   "centro-palma": [
    11,
    11
   ],
   "base-dedos": [
    11,
    6
   ],
   "base-pulgar": [
    14,
    14.4
   ],
   "muneca-centro": [
    11,
    16.6
   ],
   "muneca-menique": [
    7.8,
    16.6
   ],
   "muneca-pulgar": [
    14.2,
    16.6
   ],
   "borde-mano": [
    7,
    11
   ],
   "yema-pulgar": [
    17.8,
    6.8
   ],
   "tres-dedos": [
    11,
    20.4
   ]
  }
 },
 {
  "id": "mano-dorso",
  "name": "Dorso de la mano",
  "cat": "Manos",
  "key": "house/cuerpo-mano-dorso",
  "points": {
   "dorso-centro": [
    13,
    11
   ],
   "entre-pulgar-indice": [
    9,
    8.6
   ],
   "nudillos": [
    13,
    6.4
   ],
   "muneca-dorso": [
    13,
    16.6
   ],
   "borde-mano": [
    17,
    11
   ]
  }
 },
 {
  "id": "mano-canto",
  "name": "Canto de la mano",
  "cat": "Manos",
  "key": "house/cuerpo-mano-canto",
  "points": {
   "canto": [
    9.8,
    9
   ],
   "punta-dedos": [
    12,
    2.6
   ],
   "muneca": [
    12,
    15.2
   ]
  }
 },
 {
  "id": "puno",
  "name": "Puño",
  "cat": "Manos",
  "key": "house/cuerpo-puno",
  "points": {
   "nudillos": [
    12,
    5.4
   ],
   "puno-centro": [
    12,
    12
   ],
   "muneca": [
    12,
    17
   ]
  }
 },
 {
  "id": "senalar",
  "name": "Mano señalando",
  "cat": "Manos",
  "key": "house/cuerpo-senalar",
  "points": {
   "yema-indice": [
    10,
    2.4
   ],
   "nudillo": [
    10,
    11.8
   ],
   "dorso": [
    12,
    16
   ]
  }
 },
 {
  "id": "pulgar",
  "name": "Pulgar arriba",
  "cat": "Manos",
  "key": "house/cuerpo-pulgar",
  "points": {
   "yema-pulgar": [
    8.6,
    2.6
   ],
   "base-pulgar": [
    8.6,
    9
   ],
   "nudillos": [
    12,
    10.4
   ]
  }
 },
 {
  "id": "entre-pulgar-indice",
  "name": "Entre pulgar e índice",
  "cat": "Manos",
  "key": "house/cuerpo-entre-pulgar-indice",
  "points": {
   "entre-pulgar-indice": [
    15.6,
    9.6
   ],
   "base-pulgar": [
    16,
    14
   ],
   "dorso": [
    10,
    11
   ]
  }
 },
 {
  "id": "yema",
  "name": "Yema del dedo",
  "cat": "Manos",
  "key": "house/cuerpo-yema",
  "points": {
   "yema": [
    12,
    7.6
   ],
   "falange": [
    12,
    16
   ]
  }
 },
 {
  "id": "manos-juntas",
  "name": "Manos juntas",
  "cat": "Manos",
  "key": "house/cuerpo-manos-juntas",
  "points": {
   "palmas": [
    12,
    12
   ],
   "puntas": [
    12,
    7
   ],
   "munecas": [
    12,
    19
   ]
  }
 },
 {
  "id": "mano-sobre-mano",
  "name": "Una mano sobre la otra",
  "cat": "Manos",
  "key": "house/cuerpo-mano-sobre-mano",
  "points": {
   "centro": [
    14.5,
    10.5
   ],
   "mano-abajo": [
    8,
    15
   ]
  }
 },
 {
  "id": "tres-dedos",
  "name": "Medir tres dedos",
  "cat": "Manos",
  "key": "house/cuerpo-tres-dedos",
  "points": {
   "pliegue-muneca": [
    12,
    5.8
   ],
   "tres-dedos": [
    12,
    15.8
   ],
   "entre-tendones": [
    12,
    15.8
   ]
  }
 },
 {
  "id": "mano-abierta",
  "name": "Mano abierta (con dedos)",
  "cat": "Manos",
  "key": "house/cuerpo-mano-abierta",
  "points": {
   "centro-palma": [
    14,
    15
   ],
   "yema-mayor": [
    12,
    3
   ],
   "base-pulgar": [
    8,
    17
   ]
  }
 },
 {
  "id": "presionar-palma",
  "name": "Presionar la palma con el pulgar",
  "cat": "Manos",
  "key": "house/cuerpo-presionar-palma",
  "points": {
   "centro-palma": [
    11,
    11
   ]
  }
 },
 {
  "id": "pulso-muneca",
  "name": "Tomar el pulso en la muñeca",
  "cat": "Manos",
  "key": "house/cuerpo-pulso-muneca",
  "points": {
   "pulso": [
    12,
    12
   ],
   "muneca-centro": [
    12,
    9.4
   ]
  }
 },
 {
  "id": "pierna",
  "name": "Pierna de frente",
  "cat": "Piernas",
  "key": "house/cuerpo-pierna",
  "points": {
   "muslo": [
    12,
    6.6
   ],
   "rodilla": [
    12,
    13
   ],
   "debajo-rodilla": [
    12,
    15.6
   ],
   "espinilla": [
    12,
    18.4
   ],
   "tobillo": [
    12,
    21.6
   ]
  }
 },
 {
  "id": "pierna-perfil",
  "name": "Pierna de perfil",
  "cat": "Piernas",
  "key": "house/cuerpo-pierna-perfil",
  "points": {
   "muslo": [
    11,
    7
   ],
   "rodilla": [
    13.2,
    12.2
   ],
   "pantorrilla": [
    9.4,
    16
   ],
   "tobillo": [
    11,
    20.6
   ]
  }
 },
 {
  "id": "rodilla",
  "name": "Rodilla",
  "cat": "Piernas",
  "key": "house/cuerpo-rodilla",
  "points": {
   "rodilla": [
    12,
    12
   ],
   "debajo-rodilla": [
    12,
    17
   ],
   "costado-rodilla": [
    16.6,
    12
   ],
   "encima-rodilla": [
    12,
    7.4
   ]
  }
 },
 {
  "id": "pantorrilla",
  "name": "Pantorrilla (atrás)",
  "cat": "Piernas",
  "key": "house/cuerpo-pantorrilla",
  "points": {
   "corva": [
    12,
    7.4
   ],
   "pantorrilla": [
    12,
    12
   ],
   "talon-de-aquiles": [
    12,
    20
   ]
  }
 },
 {
  "id": "muslo",
  "name": "Muslo",
  "cat": "Piernas",
  "key": "house/cuerpo-muslo",
  "points": {
   "muslo-frente": [
    12,
    9
   ],
   "muslo-costado": [
    17.4,
    9
   ],
   "encima-rodilla": [
    12,
    15
   ]
  }
 },
 {
  "id": "tobillo",
  "name": "Tobillo",
  "cat": "Piernas",
  "key": "house/cuerpo-tobillo",
  "points": {
   "tobillo-externo": [
    15.6,
    12.6
   ],
   "tobillo-interno": [
    9,
    13
   ],
   "talon": [
    9.8,
    19
   ],
   "empeine": [
    15,
    16.6
   ]
  }
 },
 {
  "id": "corva",
  "name": "Detrás de la rodilla",
  "cat": "Piernas",
  "key": "house/cuerpo-corva",
  "points": {
   "corva": [
    12,
    12.4
   ],
   "pantorrilla": [
    12,
    18
   ],
   "muslo-atras": [
    12,
    6
   ]
  }
 },
 {
  "id": "gluteos",
  "name": "Glúteos / cadera",
  "cat": "Piernas",
  "key": "house/cuerpo-gluteos",
  "points": {
   "gluteo-derecho": [
    16,
    13
   ],
   "gluteo-izquierdo": [
    8,
    13
   ],
   "sacro": [
    12,
    7
   ],
   "cadera-derecha": [
    19,
    9
   ]
  }
 },
 {
  "id": "pierna-sentada",
  "name": "Pierna sentada",
  "cat": "Piernas",
  "key": "house/cuerpo-pierna-sentada",
  "points": {
   "muslo": [
    9,
    9
   ],
   "rodilla": [
    15.4,
    9
   ],
   "pantorrilla": [
    15.4,
    15
   ],
   "tobillo": [
    15.4,
    19.4
   ]
  }
 },
 {
  "id": "piernas",
  "name": "Piernas",
  "cat": "Piernas",
  "key": "house/cuerpo-piernas",
  "points": {
   "rodilla-derecha": [
    15,
    12
   ],
   "rodilla-izquierda": [
    9,
    12
   ],
   "muslo-derecho": [
    15,
    6
   ],
   "tobillo-derecho": [
    15,
    20.6
   ]
  }
 },
 {
  "id": "planta",
  "name": "Planta del pie",
  "cat": "Pies",
  "key": "house/cuerpo-planta",
  "points": {
   "planta-tercio": [
    12,
    11
   ],
   "dedo-gordo": [
    8.2,
    3.6
   ],
   "base-dedos": [
    12,
    6.4
   ],
   "arco": [
    8.6,
    15
   ],
   "talon": [
    12,
    19.4
   ]
  }
 },
 {
  "id": "empeine",
  "name": "Empeine (pie desde arriba)",
  "cat": "Pies",
  "key": "house/cuerpo-empeine",
  "points": {
   "empeine": [
    12,
    13
   ],
   "entre-dedo-1-y-2": [
    9.8,
    17.6
   ],
   "tobillo": [
    12,
    6
   ],
   "dedo-gordo": [
    8.6,
    21.4
   ]
  }
 },
 {
  "id": "pie-perfil",
  "name": "Pie de perfil (interno)",
  "cat": "Pies",
  "key": "house/cuerpo-pie-perfil",
  "points": {
   "arco": [
    12,
    17.6
   ],
   "talon": [
    5,
    17
   ],
   "tobillo-interno": [
    7.6,
    11
   ],
   "dedo-gordo": [
    20,
    17.4
   ],
   "empeine": [
    13,
    14
   ]
  }
 },
 {
  "id": "pie-perfil-externo",
  "name": "Pie de perfil (externo)",
  "cat": "Pies",
  "key": "house/cuerpo-pie-perfil-externo",
  "points": {
   "tobillo-externo": [
    16.4,
    11
   ],
   "talon": [
    19,
    17
   ],
   "borde-externo": [
    12,
    18.6
   ],
   "dedo-chico": [
    4,
    17.4
   ]
  }
 },
 {
  "id": "dedos-pie",
  "name": "Dedos del pie",
  "cat": "Pies",
  "key": "house/cuerpo-dedos-pie",
  "points": {
   "dedo-gordo": [
    5.5,
    10
   ],
   "entre-dedo-1-y-2": [
    7.8,
    14.6
   ],
   "dedo-chico": [
    20.2,
    12
   ]
  }
 },
 {
  "id": "talon",
  "name": "Talón",
  "cat": "Pies",
  "key": "house/cuerpo-talon",
  "points": {
   "talon": [
    12,
    16.6
   ],
   "tendon-de-aquiles": [
    12,
    6
   ],
   "tobillo-interno": [
    7.6,
    11
   ]
  }
 },
 {
  "id": "huellas",
  "name": "Huellas",
  "cat": "Pies",
  "key": "house/cuerpo-huellas",
  "points": {
   "pie-izquierdo": [
    6,
    7
   ],
   "pie-derecho": [
    18,
    11
   ]
  }
 },
 {
  "id": "pie-en-el-suelo",
  "name": "Pie apoyado en el suelo",
  "cat": "Pies",
  "key": "house/cuerpo-pie-en-el-suelo",
  "points": {
   "planta": [
    12,
    18
   ],
   "talon": [
    5,
    17
   ],
   "empeine": [
    13,
    13.6
   ],
   "suelo": [
    12,
    21
   ]
  }
 },
 {
  "id": "pies",
  "name": "Ambos pies",
  "cat": "Pies",
  "key": "house/cuerpo-pies",
  "points": {
   "planta-izquierda": [
    7.5,
    10
   ],
   "planta-derecha": [
    16.5,
    10
   ],
   "talon-derecho": [
    16.5,
    17
   ]
  }
 },
 {
  "id": "tobillo-frente",
  "name": "Tobillo y pie de frente",
  "cat": "Pies",
  "key": "house/cuerpo-tobillo-frente",
  "points": {
   "tobillo-interno": [
    7.4,
    13
   ],
   "tobillo-externo": [
    16.6,
    13
   ],
   "empeine": [
    12,
    16
   ],
   "dedos": [
    12,
    19.4
   ]
  }
 },
 {
  "id": "masaje-planta",
  "name": "Masaje en la planta",
  "cat": "Pies",
  "key": "house/cuerpo-masaje-planta",
  "points": {
   "planta-tercio": [
    12,
    11
   ],
   "talon": [
    12,
    19.4
   ]
  }
 },
 {
  "id": "cuerpo-frente",
  "name": "Cuerpo de frente",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-cuerpo-frente",
  "points": {
   "cabeza": [
    12,
    3.4
   ],
   "pecho": [
    12,
    8.4
   ],
   "panza": [
    12,
    11.8
   ],
   "hombro-derecho": [
    14,
    7.2
   ],
   "mano-derecha": [
    16.6,
    13.6
   ],
   "rodilla-derecha": [
    13.2,
    18.4
   ],
   "pie-derecho": [
    13.2,
    22.4
   ]
  }
 },
 {
  "id": "cuerpo-espalda",
  "name": "Cuerpo de espalda",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-cuerpo-espalda",
  "points": {
   "nuca": [
    12,
    6.2
   ],
   "entre-omoplatos": [
    12,
    8.4
   ],
   "lumbar": [
    12,
    12.4
   ],
   "corva-derecha": [
    13.2,
    18.4
   ],
   "talon-derecho": [
    13.2,
    22.4
   ]
  }
 },
 {
  "id": "cuerpo-perfil",
  "name": "Cuerpo de perfil",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-cuerpo-perfil",
  "points": {
   "cabeza": [
    12,
    3.4
   ],
   "pecho": [
    14,
    8.4
   ],
   "espalda": [
    9.8,
    9
   ],
   "panza": [
    14,
    12
   ],
   "rodilla": [
    12.6,
    18.4
   ]
  }
 },
 {
  "id": "sentado",
  "name": "Sentado",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-sentado",
  "points": {
   "cabeza": [
    9,
    3.4
   ],
   "espalda": [
    7.4,
    9
   ],
   "panza": [
    11,
    11.6
   ],
   "rodilla": [
    17.4,
    15.2
   ],
   "pie": [
    17.4,
    21.6
   ]
  }
 },
 {
  "id": "sentado-silla",
  "name": "Sentado en una silla",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-sentado-silla",
  "points": {
   "espalda": [
    7.4,
    9
   ],
   "panza": [
    11,
    11.6
   ],
   "pies": [
    17.4,
    22
   ],
   "rodilla": [
    17.4,
    15.2
   ]
  }
 },
 {
  "id": "meditando",
  "name": "Sentado meditando",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-meditando",
  "points": {
   "cabeza": [
    12,
    4.4
   ],
   "pecho": [
    12,
    9.6
   ],
   "panza": [
    12,
    12.6
   ],
   "manos": [
    16.8,
    15.4
   ]
  }
 },
 {
  "id": "acostado",
  "name": "Acostado boca arriba",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-acostado",
  "points": {
   "cabeza": [
    3.6,
    12
   ],
   "pecho": [
    8.4,
    12
   ],
   "panza": [
    12,
    12
   ],
   "rodillas": [
    18.4,
    12
   ]
  }
 },
 {
  "id": "acostado-mano-panza",
  "name": "Acostado con la mano en la panza",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-acostado-mano-panza",
  "points": {
   "panza": [
    10.8,
    12.4
   ],
   "pecho": [
    8.2,
    12.4
   ]
  }
 },
 {
  "id": "acostado-costado",
  "name": "Acostado de costado",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-acostado-costado",
  "points": {
   "cabeza": [
    4,
    9
   ],
   "costado": [
    10,
    8.4
   ],
   "cadera": [
    14,
    10.6
   ]
  }
 },
 {
  "id": "brazos-abiertos",
  "name": "Brazos abiertos",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-brazos-abiertos",
  "points": {
   "pecho": [
    12,
    8.4
   ],
   "panza": [
    12,
    11.8
   ],
   "mano-derecha": [
    22,
    7.4
   ],
   "mano-izquierda": [
    2,
    7.4
   ]
  }
 },
 {
  "id": "brazos-arriba",
  "name": "Brazos arriba (estirar)",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-brazos-arriba",
  "points": {
   "pecho": [
    12,
    10.4
   ],
   "costado-derecho": [
    14.8,
    11.6
   ],
   "manos": [
    12,
    1
   ]
  }
 },
 {
  "id": "caminando",
  "name": "Caminando",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-caminando",
  "points": {
   "pecho": [
    12.4,
    8.4
   ],
   "pie-derecho": [
    16,
    22
   ],
   "pie-izquierdo": [
    9.2,
    22
   ]
  }
 },
 {
  "id": "mano-en-pecho",
  "name": "Mano en el pecho",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-mano-en-pecho",
  "points": {
   "pecho": [
    12,
    17.4
   ],
   "cabeza": [
    12,
    4
   ]
  }
 },
 {
  "id": "manos-en-panza",
  "name": "Manos en la panza",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-manos-en-panza",
  "points": {
   "panza": [
    12,
    14.8
   ],
   "pecho": [
    12,
    9
   ]
  }
 },
 {
  "id": "pecho-y-panza",
  "name": "Una mano en el pecho y otra en la panza",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-pecho-y-panza",
  "points": {
   "pecho": [
    12,
    9.2
   ],
   "panza": [
    12,
    15
   ]
  }
 },
 {
  "id": "abrazo-mariposa",
  "name": "Abrazo mariposa",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-abrazo-mariposa",
  "points": {
   "pecho": [
    12,
    16
   ],
   "hombro-derecho": [
    17,
    13.4
   ],
   "hombro-izquierdo": [
    7,
    13.4
   ]
  }
 },
 {
  "id": "manos-en-sienes",
  "name": "Manos en las sienes",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-manos-en-sienes",
  "points": {
   "sien-derecha": [
    17,
    9.6
   ],
   "sien-izquierda": [
    7,
    9.6
   ],
   "frente": [
    12,
    7
   ]
  }
 },
 {
  "id": "presionar-sien",
  "name": "Presionar la sien con un dedo",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-presionar-sien",
  "points": {
   "sien-derecha": [
    16,
    9.4
   ]
  }
 },
 {
  "id": "presionar-entrecejo",
  "name": "Presionar el entrecejo",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-presionar-entrecejo",
  "points": {
   "entrecejo": [
    12,
    9.4
   ],
   "frente": [
    12,
    8
   ]
  }
 },
 {
  "id": "tirar-lobulos",
  "name": "Tirar de los lóbulos",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-tirar-lobulos",
  "points": {
   "lobulo-derecho": [
    18.4,
    12
   ],
   "lobulo-izquierdo": [
    5.6,
    12
   ]
  }
 },
 {
  "id": "masaje-mandibula",
  "name": "Masaje en la mandíbula",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-masaje-mandibula",
  "points": {
   "mandibula-derecha": [
    15.8,
    12.8
   ],
   "mandibula-izquierda": [
    8.2,
    12.8
   ],
   "atm-derecha": [
    17,
    10.6
   ]
  }
 },
 {
  "id": "manos-en-la-cara",
  "name": "Manos tapando los ojos",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-manos-en-la-cara",
  "points": {
   "ojos": [
    12,
    9.4
   ],
   "frente": [
    12,
    5.6
   ]
  }
 },
 {
  "id": "masaje-nuca",
  "name": "Masaje en la nuca",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-masaje-nuca",
  "points": {
   "nuca": [
    12,
    16.4
   ],
   "base-craneo": [
    12,
    13.2
   ]
  }
 },
 {
  "id": "tocar-coronilla",
  "name": "Mano en la coronilla",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-tocar-coronilla",
  "points": {
   "coronilla": [
    12,
    7.4
   ]
  }
 },
 {
  "id": "golpecitos-clavicula",
  "name": "Golpecitos en la clavícula",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-golpecitos-clavicula",
  "points": {
   "clavicula-derecha": [
    15,
    15.6
   ],
   "clavicula-izquierda": [
    9,
    15.6
   ]
  }
 },
 {
  "id": "hombros-arriba",
  "name": "Subir los hombros",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-hombros-arriba",
  "points": {
   "hombro-derecho": [
    18.4,
    12.6
   ],
   "hombro-izquierdo": [
    5.6,
    12.6
   ],
   "trapecio": [
    15.6,
    11.6
   ]
  }
 },
 {
  "id": "respirar",
  "name": "Respirar (pecho que se expande)",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-respirar",
  "points": {
   "pecho": [
    12,
    9
   ],
   "panza": [
    12,
    14.6
   ]
  }
 },
 {
  "id": "escaneo-corporal",
  "name": "Escaneo corporal",
  "cat": "Cuerpo y posturas",
  "key": "house/cuerpo-escaneo-corporal",
  "points": {
   "cabeza": [
    12,
    7.4
   ],
   "pecho": [
    12,
    11.4
   ],
   "panza": [
    12,
    13.6
   ]
  }
 }
];
