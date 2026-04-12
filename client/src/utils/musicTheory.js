import {
  NOTES, NOTES_FR, NOTES_FLAT, NOTES_FR_FLAT,
  SCALE_INTERVALS, CHORD_QUALITIES, CHORD_INTERVALS,
  ROMAN_NUMERALS_MAJOR,
  ROMAN_NUMERALS_MINOR_NATURAL,
  ROMAN_NUMERALS_MINOR_HARMONIC,
  ROMAN_NUMERALS_MINOR_MELODIC,
  KEY_SIGNATURES,
} from '../constants/musicTheory';

export const getKeySignature = (tonalite, gamme) => {
  const gammeKey = gamme.startsWith('mineur') ? 'mineur naturelle' : gamme;
  return KEY_SIGNATURES[gammeKey]?.[tonalite] || { type: '', notes: [] };
};

// Retourne les tableaux de noms de notes adaptés à l'armure (bémols ou dièses)
export const getNoteArrays = (tonalite, gamme) => {
  const sig = getKeySignature(tonalite, gamme);
  return sig.type === 'b'
    ? { notes: NOTES_FLAT, notesFr: NOTES_FR_FLAT }
    : { notes: NOTES,      notesFr: NOTES_FR };
};

export const getRomanNumerals = (gamme) => {
  if (gamme === 'mineur harmonique') return ROMAN_NUMERALS_MINOR_HARMONIC;
  if (gamme === 'mineur mélodique')  return ROMAN_NUMERALS_MINOR_MELODIC;
  if (gamme.startsWith('mineur'))    return ROMAN_NUMERALS_MINOR_NATURAL;
  return ROMAN_NUMERALS_MAJOR;
};

export const getScaleChords = (tonalite, gamme) => {
  const rootIndex = NOTES.indexOf(tonalite);
  if (rootIndex === -1) return [];

  const intervals     = SCALE_INTERVALS[gamme]  || SCALE_INTERVALS['Majeur'];
  const qualities     = CHORD_QUALITIES[gamme]  || CHORD_QUALITIES['Majeur'];
  const romanNumerals = getRomanNumerals(gamme);
  const { notes: noteNames, notesFr: noteNamesFr } = getNoteArrays(tonalite, gamme);

  return intervals.map((interval, index) => {
    const noteIndex = (rootIndex + interval) % 12;
    const quality   = qualities[index];
    return {
      degree:   romanNumerals[index],
      chord:    noteNames[noteIndex]   + quality,
      chordFr:  noteNamesFr[noteIndex] + quality,
      noteIndex,
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
    const chordQuality = chord.chord.includes('aug') ? 'aug'
      : chord.chord.includes('dim') ? 'dim'
      : chord.chord.includes('m')   ? 'm'
      : '';
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
