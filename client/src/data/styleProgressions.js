import { getScaleChords } from '../utils/musicTheory';

// type : 'grille' | 'liste'
// content : texte libre avec retours à la ligne et caractères spéciaux (|, –, ♩, etc.)
export const STYLE_PROGRESSIONS = {
  'Balade': {
    type: 'liste',
    content:
`I – V – vi – IV
I – IV – vi – V
vi – IV – I – V`,
  },
  'Blues': {
    type: 'grille',
    content:
`| I   | I   | I   | I   |
| IV  | IV  | I   | I   |
| V   | IV  | I   | V   |`,
  },
  'Electro': {
    type: 'liste',
    content:
`i – VI – III – VII
i – VII – VI – VII`,
  },
  'Funk': {
    type: 'liste',
    content:
`I – IV – I – IV
I – IV – V – IV`,
  },
  'Grunge': {
    type: 'liste',
    content:
`i – VII – VI – VII
i – III – VII – IV`,
  },
  'Jazz': {
    type: 'grille',
    content:
`| IIm | V   | I   | I   |
| IIm | V   | I   | vi  |
| IIm | V   | I   | I   |`,
  },
  'Hip-Hop': {
    type: 'liste',
    content:
`i – VII – VI – VII
i – VI – III – VII`,
  },
  'melancolique': {
    type: 'liste',
    content:
`i – VI – III – VII
i – iv – i – V`,
  },
  'Metal': {
    type: 'liste',
    content:
`i – VII – VI – V
i – iv – v – i`,
  },
  'Pop': {
    type: 'liste',
    content:
`I – V – vi – IV
I – IV – V – IV
vi – IV – I – V`,
  },
  'Rap': {
    type: 'liste',
    content:
`i – VII – VI – VII
i – VI – III – VII`,
  },
  'Reggae': {
    type: 'grille',
    content:
`| I   | IV  | I   | IV  |
| V   | IV  | I   | I   |`,
  },
  'Rock': {
    type: 'liste',
    content:
`I – IV – V – I
I – VII – IV – I
i – VII – VI – VII`,
  },
  'Soul/R&B': {
    type: 'grille',
    content:
`| I   | IV  | I   | I   |
| IV  | IV  | I   | I   |
| V   | IV  | I   | V   |`,
  },
  'Valse': {
    type: 'grille',
    content:
`| I   | I   | I   | IV  | IV  | I   |
| V   | V   | I   | I   | I   | I   |`,
  },
};

// Convertit les chiffres romains d'un texte de progression en noms d'accords réels.
// Les suffixes de qualité (°, +, m) sont consommés — la qualité réelle vient de la gamme.
export const replaceDegreesWithChords = (content, tonalite, gamme) => {
  const scaleChords = getScaleChords(tonalite, gamme);
  const NUMERAL_TO_INDEX = {
    'VII': 6, 'VI': 5, 'IV': 3, 'V': 4, 'III': 2, 'II': 1, 'I': 0,
    'vii': 6, 'vi': 5, 'iv': 3, 'v': 4, 'iii': 2, 'ii': 1, 'i': 0,
  };
  return content.replace(
    /(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)[°+m]?/g,
    (match, numeral) => {
      const index = NUMERAL_TO_INDEX[numeral];
      return index !== undefined ? (scaleChords[index]?.chord ?? match) : match;
    }
  );
};
