import React from 'react';
import { getScaleChords } from '../utils/musicTheory';

const ScaleChords = ({ tonalite, gamme, style }) => (
  <div className="scale-chords" style={style}>
    <h3>Accords de {tonalite} {gamme}</h3>
    <div className="chords-list">
      {getScaleChords(tonalite, gamme).map((item, index) => (
        <div key={index} className="chord-item">
          <span className="chord-degree">{item.degree}</span>
          <div className="chord-full-name">
            <span className="chord-name">{item.chord}</span>
            <span className="chord-name-en">({item.chordFr})</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ScaleChords;
