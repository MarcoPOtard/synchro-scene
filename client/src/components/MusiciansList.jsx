import React from 'react';

const MusiciansList = ({ musicians, musicianName }) => (
  <section className="musicians-section">
    <h3>Musiciens connectés ({musicians.length})</h3>
    <ul className="musicians-list">
      {musicians.map((musician) => (
        <li
          key={musician.id}
          className={musician.name === musicianName ? 'current-user' : ''}
        >
          🎹 {musician.name}
          {musician.name === musicianName && ' (vous)'}
        </li>
      ))}
    </ul>
  </section>
);

export default MusiciansList;
