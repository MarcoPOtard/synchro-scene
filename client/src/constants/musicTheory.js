// Notes chromatiques (dièses)
export const NOTES    = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FR = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Notes chromatiques (bémols — utilisées quand l'armure est en bémols)
export const NOTES_FLAT    = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const NOTES_FR_FLAT = ['Do', 'Réb', 'Ré', 'Mib', 'Mi', 'Fa', 'Solb', 'Sol', 'Lab', 'La', 'Sib', 'Si'];

// Intervalles des gammes (en demi-tons)
export const SCALE_INTERVALS = {
  'Majeur':             [0, 2, 4, 5, 7, 9, 11],
  'mineur naturelle':   [0, 2, 3, 5, 7, 8, 10],
  'mineur harmonique':  [0, 2, 3, 5, 7, 8, 11],
  'mineur mélodique':   [0, 2, 3, 5, 7, 9, 11],
  'Japonaise Hirajōshi': [0, 2, 3, 7, 8],            // T ½ 2T ½ 2T
  'Chinoise':            [0, 2, 4, 7, 9],            // T T 1½ T 1½
  'Orientale':           [0, 1, 4, 5, 7, 8, 11],     // ½ 1½ ½ T ½ 1½ ½
};

// Gammes non diatoniques : pas d'armure propre. On emprunte celle d'une gamme de
// référence uniquement pour choisir entre dièses et bémols dans le nom des notes.
export const SCALE_NAMING_REFERENCE = {
  'Japonaise Hirajōshi': 'mineur naturelle',
  'Chinoise':            'Majeur',
  'Orientale':           'mineur naturelle',
};

// Qualités des accords pour chaque degré (gammes diatoniques).
// Pour les autres gammes, les qualités sont calculées (voir getScaleQualities).
export const CHORD_QUALITIES = {
  'Majeur':             ['', 'm', 'm', '', '', 'm', 'dim'],
  'mineur naturelle':   ['m', 'dim', '', 'm', 'm', '', ''],
  'mineur harmonique':  ['m', 'dim', 'aug', 'm', '', '', 'dim'],
  'mineur mélodique':   ['m', 'm', 'aug', '', '', 'dim', 'dim'],
};

// Chiffres romains pour les degrés, par type de gamme
export const ROMAN_NUMERALS_MAJOR           = ['I',  'ii',  'iii',  'IV', 'V', 'vi',  'vii°'];
export const ROMAN_NUMERALS_MINOR_NATURAL   = ['i',  'ii°', 'III',  'iv', 'v', 'VI',  'VII'];
export const ROMAN_NUMERALS_MINOR_HARMONIC  = ['i',  'ii°', 'III+', 'iv', 'V', 'VI',  'vii°'];
export const ROMAN_NUMERALS_MINOR_MELODIC   = ['i',  'ii',  'III+', 'IV', 'V', 'vi°', 'vii°'];

// Intervalles des types d'accords (en demi-tons depuis la fondamentale)
export const CHORD_INTERVALS = {
  '':    [0, 4, 7],  // Majeur
  'm':   [0, 3, 7],  // mineur
  'dim': [0, 3, 6],  // diminué
  'aug': [0, 4, 8],  // augmenté
  'sus4': [0, 5, 7], // suspendu 4
  'sus2': [0, 2, 7], // suspendu 2
};

// Ordre de préférence des accords cherchés sur chaque degré d'une gamme non diatonique
export const COMPUTED_CHORD_QUALITIES = ['', 'm', 'sus4', 'sus2', 'dim', 'aug'];

// Altérations à la clé selon la tonalité et la gamme
// Les trois variantes mineures partagent la même armure (le mineur naturel)
export const KEY_SIGNATURES = {
  'Majeur': {
    'C':  { type: '', notes: [] },
    'C#': { type: 'b', notes: ['Si', 'Mi', 'La', 'Ré', 'Sol'], enharmonic: 'Réb' },
    'D':  { type: '#', notes: ['Fa', 'Do'] },
    'D#': { type: 'b', notes: ['Si', 'Mi', 'La'], enharmonic: 'Mib' },
    'E':  { type: '#', notes: ['Fa', 'Do', 'Sol', 'Ré'] },
    'F':  { type: 'b', notes: ['Si'] },
    'F#': { type: '#', notes: ['Fa', 'Do', 'Sol', 'Ré', 'La', 'Mi'] },
    'G':  { type: '#', notes: ['Fa'] },
    'G#': { type: 'b', notes: ['Si', 'Mi', 'La', 'Ré'], enharmonic: 'Lab' },
    'A':  { type: '#', notes: ['Fa', 'Do', 'Sol'] },
    'A#': { type: 'b', notes: ['Si', 'Mi'], enharmonic: 'Sib' },
    'B':  { type: '#', notes: ['Fa', 'Do', 'Sol', 'Ré', 'La'] },
  },
  'mineur naturelle': {
    'C':  { type: 'b', notes: ['Si', 'Mi', 'La'] },
    'C#': { type: '#', notes: ['Fa', 'Do', 'Sol', 'Ré'] },
    'D':  { type: 'b', notes: ['Si'] },
    'D#': { type: 'b', notes: ['Si', 'Mi', 'La', 'Ré', 'Sol', 'Do'], enharmonic: 'Mib' },
    'E':  { type: '#', notes: ['Fa'] },
    'F':  { type: 'b', notes: ['Si', 'Mi', 'La', 'Ré'] },
    'F#': { type: '#', notes: ['Fa', 'Do', 'Sol'] },
    'G':  { type: 'b', notes: ['Si', 'Mi'] },
    'G#': { type: '#', notes: ['Fa', 'Do', 'Sol', 'Ré', 'La'] },
    'A':  { type: '', notes: [] },
    'A#': { type: 'b', notes: ['Si', 'Mi', 'La', 'Ré', 'Sol'], enharmonic: 'Sib' },
    'B':  { type: '#', notes: ['Fa', 'Do'] },
  },
};
