import { getScaleChords, getNoteArrays } from '../utils/musicTheory';
import { NOTES, SCALE_INTERVALS } from '../constants/musicTheory';

// type : 'grille' | 'liste'
// content : texte libre avec retours à la ligne et caractères spéciaux (|, –, ♩, etc.)
// degresFixes : la progression ne dépend pas de la gamme choisie, seulement de la tonalité.
//   Chaque degré porte sa propre qualité : majuscule = majeur, minuscule = mineur,
//   ° = diminué, + = augmenté ; ♭ / ♯ altère le degré par rapport à la gamme majeure.
// armure : gamme de référence pour nommer les notes (dièses ou bémols) en mode degresFixes.
export const STYLE_PROGRESSIONS = {
  'Balade Pop': {
    type: 'grille',
    degresFixes: true,
    armure: 'mineur naturelle',
    content:
`|i   |♭III –   |♭VII –   |IV   |`,
  },
  'Swing Manouche': {
    type: 'grille',
    degresFixes: true,
    armure: 'mineur naturelle',
    content:
`| i   | ♭VI | II  | V   |`,
  },
  'Médiéval': {
    type: '',
    degresFixes: true,
    armure: 'majeur',
    info: 'Basse fondamentale quinte',
    content:'',
  },
//   'Balade': {
//     type: 'liste',
//     content:
// `I – V – vi – IV
// I – IV – vi – V
// vi – IV – I – V`,
//   },
  'Blues': {
    type: 'grille',
    content:
`| I   | I   | I   | I   |
| IV  | IV  | I   | I   |
| V   | IV  | I   | V   |`,
  },
  'New Varietoche': {
    type: 'grille',
    info: 'si Mineur alors Mineur Naturel',
    content:
`| I   | VI  | III   | III   |`,
  },
  
//   'Electro': {
//     type: 'liste',
//     content:
// `i – VI – III – VII
// i – VII – VI – VII`,
//   },
//   'Funk': {
//     type: 'liste',
//     content:
// `I – IV – I – IV
// I – IV – V – IV`,
//   },
//   'Grunge': {
//     type: 'liste',
//     content:
// `i – VII – VI – VII
// i – III – VII – IV`,
//   },
  'Jazz': {
    type: 'grille',
    content:
`| IIm | V   | I   | I   |
| IIm | V   | I   | vi  |
| IIm | V   | I   | I   |`,
  },
//   'Hip-Hop': {
//     type: 'liste',
//     content:
// `i – VII – VI – VII
// i – VI – III – VII`,
//   },
//   'melancolique': {
//     type: 'liste',
//     content:
// `i – VI – III – VII
// i – iv – i – V`,
//   },
//   'Metal': {
//     type: 'liste',
//     content:
// `i – VII – VI – V
// i – iv – v – i`,
//   },
//   'Pop': {
//     type: 'liste',
//     content:
// `I – V – vi – IV
// I – IV – V – IV
// vi – IV – I – V`,
//   },
//   'Rap': {
//     type: 'liste',
//     content:
// `i – VII – VI – VII
// i – VI – III – VII`,
//   },
//   'Reggae': {
//     type: 'grille',
//     content:
// `| I   | IV  | I   | IV  |
// | V   | IV  | I   | I   |`,
//   },
//   'Rock': {
//     type: 'liste',
//     content:
// `I – IV – V – I
// I – VII – IV – I
// i – VII – VI – VII`,
//   },
//   'Soul/R&B': {
//     type: 'grille',
//     content:
// `| I   | IV  | I   | I   |
// | IV  | IV  | I   | I   |
// | V   | IV  | I   | V   |`,
//   },
//   'Valse': {
//     type: 'grille',
//     content:
// `| I   | I   | I   | IV  | IV  | I   |
// | V   | V   | I   | I   | I   | I   |`,
//   },
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
      return scaleChords.find((c) => c.degreeIndex === index)?.chord ?? match;
    }
  );
};

// Convertit une progression à degrés fixes en accords, d'après la seule tonalité.
// La qualité de chaque accord est portée par le chiffre romain lui-même.
const ROMAN_TO_INDEX = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };
const ACCIDENTAL_OFFSET = { '♭': -1, 'b': -1, '♯': 1, '#': 1 };

export const replaceFixedDegreesWithChords = (content, tonalite, armure = 'Majeur') => {
  const rootIndex = NOTES.indexOf(tonalite);
  if (rootIndex === -1) return content;
  const { notes: noteNames } = getNoteArrays(tonalite, armure);

  return content.replace(
    /([♭♯b#]?)(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)([°+]?)/g,
    (match, accidental, numeral, suffix) => {
      const interval = SCALE_INTERVALS['Majeur'][ROMAN_TO_INDEX[numeral.toUpperCase()]]
        + (ACCIDENTAL_OFFSET[accidental] ?? 0);
      const noteIndex = (rootIndex + interval + 12) % 12;
      const isMinor = numeral === numeral.toLowerCase();
      const quality = suffix === '°' ? 'dim' : suffix === '+' ? 'aug' : isMinor ? 'm' : '';
      return noteNames[noteIndex] + quality;
    }
  );
};
