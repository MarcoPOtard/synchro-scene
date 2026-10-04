import React from 'react';
import { getKeySignature, getNoteArrays, getScaleNotes, isDiatonic } from '../utils/musicTheory';

const KeySignature = ({ tonalite, gamme, style }) => {
  // Gammes non diatoniques : pas d'armure, on affiche directement les notes de la gamme
  if (!isDiatonic(gamme)) {
    const { notesFr } = getNoteArrays(tonalite, gamme);
    return (
      <div className="key-signature" style={style}>
        <h3>Notes de la gamme</h3>
        <div className="alteration-notes">
          {getScaleNotes(tonalite, gamme).map((noteIndex, i) => (
            <span key={i} className="alteration-note">{notesFr[noteIndex]}</span>
          ))}
        </div>
      </div>
    );
  }

  const sig = getKeySignature(tonalite, gamme);
  const symbol = sig.type === '#' ? '♯' : '♭';

  return (
    <div className="key-signature" style={style}>
      <h3>
        Altérations à la clé
        {sig.enharmonic ? ` (= ${sig.enharmonic} ${gamme})` : ''}
      </h3>
      {sig.notes.length === 0 ? (
        <p className="no-alterations">Aucune altération</p>
      ) : (
        <div className="alterations-display">
          <span className="alteration-count">{sig.notes.length}{symbol}</span>
          <div className="alteration-notes">
            {sig.notes.map((note, i) => (
              <span key={i} className="alteration-note">{note}{symbol}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeySignature;
