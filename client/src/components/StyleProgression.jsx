import React from 'react';
import { STYLE_PROGRESSIONS, replaceDegreesWithChords } from '../data/styleProgressions';

const StyleProgression = ({ musicStyle, tonalite, gamme, style }) => {
  const prog = STYLE_PROGRESSIONS[musicStyle];
  if (!prog) return null;

  const chordsContent = replaceDegreesWithChords(prog.content, tonalite, gamme);

  return (
    <div className="style-progression" style={style}>
      <h3>
        Progression {musicStyle}
        <span className="progression-type-badge">
          {prog.type === 'grille' ? 'Grille' : 'Liste'}
        </span>
      </h3>
      <div className="progression-columns">
        <div className="progression-column">
          <div className="progression-column-label">Degrés</div>
          <pre className={`progression-content progression-${prog.type}`}>
            {prog.content}
          </pre>
        </div>
        <div className="progression-column">
          <div className="progression-column-label">
            Accords — {tonalite} {gamme}
          </div>
          <pre className={`progression-content progression-${prog.type}`}>
            {chordsContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StyleProgression;
