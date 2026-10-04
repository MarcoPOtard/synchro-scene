import {
  NOTES, NOTES_FR, NOTES_FLAT, NOTES_FR_FLAT,
  SCALE_INTERVALS, CHORD_QUALITIES, CHORD_INTERVALS,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR_NATURAL,
  ROMAN_NUMERALS_MINOR_HARMONIC,
  ROMAN_NUMERALS_MINOR_MELODIC,
  KEY_SIGNATURES,
  SCALE_NAMING_REFERENCE,
  COMPUTED_CHORD_QUALITIES,
} from '../constants/musicTheory';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// Gamme diatonique = gamme à 7 degrés avec une armure (Majeur et mineurs)
export const isDiatonic = (gamme) => gamme in CHORD_QUALITIES;

export const getKeySignature = (tonalite, gamme) => {
  const gammeKey = gamme.startsWith('mineur') ? 'mineur naturelle' : gamme;
  return KEY_SIGNATURES[gammeKey]?.[tonalite] || { type: '', notes: [] };
};

// Retourne les tableaux de noms de notes adaptés à l'armure (bémols ou dièses)
export const getNoteArrays = (tonalite, gamme) => {
  const sig = getKeySignature(tonalite, SCALE_NAMING_REFERENCE[gamme] || gamme);
  return sig.type === 'b'
    ? { notes: NOTES_FLAT, notesFr: NOTES_FR_FLAT }
    : { notes: NOTES,      notesFr: NOTES_FR };
};

// Qualité d'accord de chaque degré. Pour les gammes non diatoniques, on retient
// le premier accord de COMPUTED_CHORD_QUALITIES dont toutes les notes sont dans
// la gamme ; null si aucun accord ne tient sur ce degré.
export const getScaleQualities = (gamme) => {
  if (isDiatonic(gamme)) return CHORD_QUALITIES[gamme];

  const intervals = SCALE_INTERVALS[gamme] || SCALE_INTERVALS['Majeur'];
  return intervals.map((degree) =>
    COMPUTED_CHORD_QUALITIES.find((quality) =>
      CHORD_INTERVALS[quality].every((i) => intervals.includes((degree + i) % 12))
    ) ?? null
  );
};

// Degré (0 = I … 6 = VII) d'une note d'une gamme non diatonique, d'après son
// intervalle depuis la tonique, avec l'altération par rapport à la gamme majeure.
const MAJOR_INTERVALS = SCALE_INTERVALS['Majeur'];
//                        demi-tons :  0  1  2  3  4  5  6  7  8  9 10 11
const INTERVAL_TO_DEGREE_INDEX     = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6];
const getDegree = (interval) => {
  const index = INTERVAL_TO_DEGREE_INDEX[interval];
  const accidental = interval < MAJOR_INTERVALS[index] ? 'b'
    : interval > MAJOR_INTERVALS[index] ? '#'
    : '';
  return { index, accidental };
};

export const getRomanNumerals = (gamme) => {
  if (gamme === 'mineur harmonique') return ROMAN_NUMERALS_MINOR_HARMONIC;
  if (gamme === 'mineur mélodique')  return ROMAN_NUMERALS_MINOR_MELODIC;
  if (gamme.startsWith('mineur'))    return ROMAN_NUMERALS_MINOR_NATURAL;
  if (isDiatonic(gamme))             return ROMAN_NUMERALS_MAJOR;

  const intervals = SCALE_INTERVALS[gamme];
  return getScaleQualities(gamme).map((quality, i) => {
    const { index, accidental } = getDegree(intervals[i]);
    const numeral = accidental + ROMAN_NUMERALS[index];
    if (quality === 'm')   return numeral.toLowerCase();
    if (quality === 'dim') return numeral.toLowerCase() + '°';
    if (quality === 'aug') return numeral + '+';
    return numeral;
  });
};

export const getScaleChords = (tonalite, gamme) => {
  const rootIndex = NOTES.indexOf(tonalite);
  if (rootIndex === -1) return [];

  const intervals     = SCALE_INTERVALS[gamme]  || SCALE_INTERVALS['Majeur'];
  const qualities     = getScaleQualities(gamme);
  const romanNumerals = getRomanNumerals(gamme);
  const { notes: noteNames, notesFr: noteNamesFr } = getNoteArrays(tonalite, gamme);

  return intervals.map((interval, index) => {
    const noteIndex = (rootIndex + interval) % 12;
    const quality   = qualities[index];
    return {
      degree:   romanNumerals[index],
      chord:    noteNames[noteIndex]   + (quality ?? ''),
      chordFr:  noteNamesFr[noteIndex] + (quality ?? ''),
      noteIndex,
      degreeIndex: isDiatonic(gamme) ? index : getDegree(interval).index,  // 0 = I … 6 = VII
      quality,  // null : aucun accord ne tient sur ce degré (note seule)
    };
  });
};

export const getChordNotes = (rootIndex, quality) => {
  const intervals = CHORD_INTERVALS[quality] || CHORD_INTERVALS[''];
  return intervals.map(interval => (rootIndex + interval) % 12);
};

export const getScaleNotes = (tonalite, gamme) => {
  const rootIndex = NOTES.indexOf(tonalite);
  if (rootIndex === -1) return [];

  const intervals = SCALE_INTERVALS[gamme] || SCALE_INTERVALS['Majeur'];
  return intervals.map(interval => (rootIndex + interval) % 12);
};

const countCommonNotes = (notes1, notes2) =>
  notes1.filter(note => notes2.includes(note)).length;

const isChordInScale = (chordNotes, scaleNotes) =>
  chordNotes.every(note => scaleNotes.includes(note));

export const getCommonToneSubstitutions = (tonalite, gamme) => {
  const chords     = getScaleChords(tonalite, gamme);
  const scaleNotes = getScaleNotes(tonalite, gamme);
  const qualities  = ['', 'm', 'dim', 'aug'];
  const { notes: noteNames, notesFr: noteNamesFr } = getNoteArrays(tonalite, gamme);

  return chords.map((chord) => {
    const chordQuality = chord.quality;
    if (chordQuality === null) return { original: chord, substitutions: [] };
    const chordNotes = getChordNotes(chord.noteIndex, chordQuality);

    const substitutions = [];

    for (let i = 0; i < 12; i++) {
      for (const quality of qualities) {
        const candidateNotes = getChordNotes(i, quality);
        if (!isChordInScale(candidateNotes, scaleNotes)) continue;

        const commonCount = countCommonNotes(chordNotes, candidateNotes);
        if (commonCount === 2 && (i !== chord.noteIndex || quality !== chordQuality)) {
          substitutions.push({
            chord:   noteNames[i]   + quality,
            chordFr: noteNamesFr[i] + quality,
          });
        }
      }
    }

    return { original: chord, substitutions };
  });
};
