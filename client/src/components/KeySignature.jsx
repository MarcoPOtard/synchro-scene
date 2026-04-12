import React from 'react';
import { getKeySignature } from '../utils/musicTheory';

const KeySignature = ({ tonalite, gamme, style }) => {
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
