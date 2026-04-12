import React from 'react';
import { getCommonToneSubstitutions } from '../utils/musicTheory';

const CommonToneSubstitutions = ({ tonalite, gamme, style }) => (
  <div className="common-tone-substitutions" style={style}>
    <h3>Substitutions (2 notes communes)</h3>
    <div className="substitutions-grid">
      {getCommonToneSubstitutions(tonalite, gamme).map((item, index) => (
        <div key={index} className="substitution-item">
          <span className="sub-original">{item.original.chord}</span>
          <span className="sub-options">
            {item.substitutions.map((s) => s.chord).join(', ')}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default CommonToneSubstitutions;
