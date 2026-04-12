import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Configuration de la connexion Socket.io
// Utilise automatiquement l'IP/hostname du serveur qui sert la page
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
  `http://${window.location.hostname}:3001`;

// Notes chromatiques
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FR = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// Intervalles des gammes (en demi-tons)
const SCALE_INTERVALS = {
  'Majeur': [0, 2, 4, 5, 7, 9, 11],
  'mineur': [0, 2, 3, 5, 7, 8, 10]
};

// Qualités des accords pour chaque degré
const CHORD_QUALITIES = {
  'Majeur': ['', 'm', 'm', '', '', 'm', 'dim'],
  'mineur': ['m', 'dim', '', 'm', 'm', '', '']
};

// Chiffres romains pour les degrés
const ROMAN_NUMERALS_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const ROMAN_NUMERALS_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

// Altérations à la clé selon la tonalité et la gamme
const KEY_SIGNATURES = {
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
  'mineur': {
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
  }
};

const getKeySignature = (tonalite, gamme) => {
  return KEY_SIGNATURES[gamme]?.[tonalite] || { type: '', notes: [] };
};

// Fonction pour calculer les accords de la gamme
const getScaleChords = (tonalite, gamme) => {
  const rootIndex = NOTES.indexOf(tonalite);
  if (rootIndex === -1) return [];

  const intervals = SCALE_INTERVALS[gamme] || SCALE_INTERVALS['Majeur'];
  const qualities = CHORD_QUALITIES[gamme] || CHORD_QUALITIES['Majeur'];
  const romanNumerals = gamme === 'mineur' ? ROMAN_NUMERALS_MINOR : ROMAN_NUMERALS_MAJOR;

  return intervals.map((interval, index) => {
    const noteIndex = (rootIndex + interval) % 12;
    const note = NOTES[noteIndex];
    const noteFr = NOTES_FR[noteIndex];
    const quality = qualities[index];
    return {
      degree: romanNumerals[index],
      chord: note + quality,
      chordFr: noteFr + quality,
      noteIndex: noteIndex
    };
  });
};

// Intervalles des types d'accords (en demi-tons depuis la fondamentale)
const CHORD_INTERVALS = {
  '': [0, 4, 7],      // Majeur: fondamentale, tierce majeure, quinte
  'm': [0, 3, 7],     // mineur: fondamentale, tierce mineure, quinte
  'dim': [0, 3, 6]    // diminué: fondamentale, tierce mineure, quinte diminuée
};

// Fonction pour obtenir les notes d'un accord
const getChordNotes = (rootIndex, quality) => {
  const intervals = CHORD_INTERVALS[quality] || CHORD_INTERVALS[''];
  return intervals.map(interval => (rootIndex + interval) % 12);
};

// Fonction pour compter les notes communes entre deux accords
const countCommonNotes = (notes1, notes2) => {
  return notes1.filter(note => notes2.includes(note)).length;
};

// Fonction pour obtenir les notes de la gamme (indices des notes)
const getScaleNotes = (tonalite, gamme) => {
  const rootIndex = NOTES.indexOf(tonalite);
  if (rootIndex === -1) return [];

  const intervals = SCALE_INTERVALS[gamme] || SCALE_INTERVALS['Majeur'];
  return intervals.map(interval => (rootIndex + interval) % 12);
};

// Fonction pour vérifier si toutes les notes d'un accord sont dans la gamme
const isChordInScale = (chordNotes, scaleNotes) => {
  return chordNotes.every(note => scaleNotes.includes(note));
};

// Fonction pour calculer les substitutions par tons communs (2 notes en commun, dans la gamme)
const getCommonToneSubstitutions = (tonalite, gamme) => {
  const chords = getScaleChords(tonalite, gamme);
  const scaleNotes = getScaleNotes(tonalite, gamme);
  const qualities = ['', 'm', 'dim'];

  return chords.map((chord) => {
    const chordNotes = getChordNotes(chord.noteIndex,
      chord.chord.includes('dim') ? 'dim' : (chord.chord.includes('m') ? 'm' : ''));

    const substitutions = [];

    // Parcourir toutes les notes possibles et tous les types d'accords
    for (let i = 0; i < 12; i++) {
      for (const quality of qualities) {
        const candidateNotes = getChordNotes(i, quality);

        // Vérifier que toutes les notes de l'accord candidat sont dans la gamme
        if (!isChordInScale(candidateNotes, scaleNotes)) {
          continue;
        }

        const commonCount = countCommonNotes(chordNotes, candidateNotes);

        // On veut exactement 2 notes communes et que ce ne soit pas le même accord
        if (commonCount === 2) {
          const candidateChord = NOTES[i] + quality;
          const candidateChordFr = NOTES_FR[i] + quality;

          // Éviter de lister le même accord
          if (candidateChord !== chord.chord) {
            substitutions.push({
              chord: candidateChord,
              chordFr: candidateChordFr
            });
          }
        }
      }
    }

    return {
      original: chord,
      substitutions: substitutions
    };
  });
};

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [musicianName, setMusicianName] = useState('');
  const [registered, setRegistered] = useState(false);
  
  // État partagé
  const [state, setState] = useState({
    style: 'Pop',
    tonalite: 'C',
    gamme: 'Majeur',
    notes: '',
    lastUpdate: null,
    updatedBy: null,
    displayChange: 'acc-alt-sub',
  });
  
  // Liste des musiciens connectés
  const [musicians, setMusicians] = useState([]);
  
  // Messages de chat
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Initialisation de la connexion Socket.io
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur');
      setConnected(false);
    });

    // Réception de l'état initial
    newSocket.on('initial-state', (initialState) => {
      console.log('📥 État initial reçu:', initialState);
      setState(initialState);
    });

    // Réception d'une mise à jour d'état
    newSocket.on('state-updated', (updatedState) => {
      console.log('🔄 État mis à jour:', updatedState);
      setState(updatedState);
      
      // Notification visuelle
      showNotification(`Mis à jour par ${updatedState.updatedBy}`);
    });

    // Réception de la liste des musiciens
    newSocket.on('musicians-list', (musiciansList) => {
      console.log('👥 Musiciens connectés:', musiciansList);
      setMusicians(musiciansList);
    });

    // Réception de nouveaux messages
    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fonction pour afficher une notification
  const showNotification = (message) => {
    // Vous pouvez améliorer cela avec une bibliothèque de notifications
    console.log('🔔', message);
  };

  // Enregistrement du musicien
  const handleRegister = (e) => {
    e.preventDefault();
    if (musicianName.trim() && socket) {
      socket.emit('register-musician', musicianName.trim());
      setRegistered(true);
      localStorage.setItem('musicianName', musicianName.trim());
    }
  };

  // Mise à jour d'une propriété de l'état
  const updateState = (key, value) => {
    if (!socket || !connected) return;
    
    const update = { [key]: value };
    
    // Mise à jour locale immédiate
    setState(prev => ({ ...prev, ...update }));
    
    // Envoi au serveur
    socket.emit('update-state', update);
  };

  // Envoi d'un message
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socket) {
      socket.emit('send-message', messageInput.trim());
      setMessageInput('');
    }
  };

  // Écran d'enregistrement
  if (!registered) {
    return (
      <div className="App">
        <div className="register-screen">
          <h1>🎵 Comédie Musicale Improvisée</h1>
          <p className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '✅ Connecté au serveur' : '⏳ Connexion au serveur...'}
          </p>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Votre nom (ex: Marc - Piano)"
              value={musicianName}
              onChange={(e) => setMusicianName(e.target.value)}
              disabled={!connected}
              autoFocus
            />
            <button type="submit" disabled={!connected || !musicianName.trim()}>
              Rejoindre le concert
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Interface principale
  return (
      <div className="App">
          <header className="app-header">
              <h1>🎵 Comédie Musicale Improvisée</h1>
              <select 
                className="app-header__display-change"
                name="display-change"
                value={state.displayChange}
                onChange={(e) => 
                    updateState("displayChange", e.target.value)
                }
              >
                <option value="acc-alt-sub">Accords - Altérations - Substitutions</option>
                <option value="acc-sub-alt">Accords - Substitutions - Altérations</option>
                <option value="alt-acc-sub">Altérations - Accords - Substitutions</option>
                <option value="alt-sub-acc">Altérations - Substitutions - Accords</option>
                <option value="sub-alt-acc">Substitutions - Altérations - Accords</option>
                <option value="sub-acc-alt">Substitutions - Accords - Altérations</option>
              </select>
              <div className="header-info">
                  <span className="musician-name">👤 {musicianName}</span>
                  <span
                      className={`connection-indicator ${
                          connected ? "connected" : "disconnected"
                      }`}
                  >
                      {connected ? "🟢" : "🔴"}
                  </span>
              </div>
          </header>

          <div className="main-content">
              {/* Section des contrôles principaux */}
              <section className="controls-section">
                  <h2>Paramètres du morceau</h2>

                  <div className="control-group">
                      <label>
                          Tonalité
                          <select
                              value={state.tonalite}
                              onChange={(e) =>
                                  updateState("tonalite", e.target.value)
                              }
                          >
                              <option value="C">Do (C)</option>
                              <option value="C#">Do# (C#)</option>
                              <option value="D">Ré (D)</option>
                              <option value="D#">Ré# (D#)</option>
                              <option value="E">Mi (E)</option>
                              <option value="F">Fa (F)</option>
                              <option value="F#">Fa# (F#)</option>
                              <option value="G">Sol (G)</option>
                              <option value="G#">Sol# (G#)</option>
                              <option value="A">La (A)</option>
                              <option value="A#">La# (A#)</option>
                              <option value="B">Si (B)</option>
                          </select>
                      </label>

                      <label>
                          Gamme
                          <select
                              value={state.gamme}
                              onChange={(e) =>
                                  updateState("gamme", e.target.value)
                              }
                          >
                              <option value="Majeur">Majeur</option>
                              <option value="mineur">mineur</option>
                          </select>
                      </label>

                      <label>
                          Style
                          <select
                              value={state.style}
                              onChange={(e) =>
                                  updateState("style", e.target.value)
                              }
                          >
                              <option value="Balade">Balade</option>
                              <option value="Blues">Blues</option>
                              <option value="Electro">Electro</option>
                              <option value="Funk">Funk</option>
                              <option value="Grunge">Grunge</option>
                              <option value="Jazz">Jazz</option>
                              <option value="Hip-Hop">Hip-Hop</option>
                              <option value="melancolique">Mélancolique</option>
                              <option value="Metal">Metal</option>
                              <option value="Pop">Pop</option>
                              <option value="Rap">Rap</option>
                              <option value="Reggae">Reggae</option>
                              <option value="Rock">Rock</option>
                              <option value="Soul/R&B">Soul/R&B</option>
                              <option value="Valse">Valse</option>
                          </select>
                      </label>
                  </div>

                  <div className="control-group full-width">
                      <label>
                          Notes / Instructions
                          <textarea
                              value={state.notes}
                              onChange={(e) =>
                                  updateState("notes", e.target.value)
                              }
                              placeholder="Notes partagées, instructions, changements..."
                              rows="2"
                          />
                      </label>
                  </div>

                  <div className={`display-change ${state.displayChange}`}>

                      {/* Affichage des accords de la gamme */}
                      <div className="scale-chords">
                          <h3>
                              Accords de {state.tonalite} {state.gamme}
                          </h3>
                          <div className="chords-list">
                              {getScaleChords(state.tonalite, state.gamme).map(
                                  (item, index) => (
                                      <div key={index} className="chord-item">
                                          <span className="chord-degree">
                                              {item.degree}
                                          </span>
                                          <div class="chord-full-name">
                                              <span className="chord-name">
                                                  {item.chord}
                                              </span>
                                              <span className="chord-name-en">
                                                  ({item.chordFr})
                                              </span>
                                          </div>
                                      </div>
                                  )
                              )}
                          </div>
                      </div>

                      {/* Altérations à la clé */}
                      <div className="key-signature">
                          <h3>
                              Altérations à la clé
                              {(() => {
                                  const sig = getKeySignature(
                                      state.tonalite,
                                      state.gamme
                                  );
                                  return sig.enharmonic
                                      ? ` (= ${sig.enharmonic} ${state.gamme})`
                                      : "";
                              })()}
                          </h3>
                          {(() => {
                              const sig = getKeySignature(
                                  state.tonalite,
                                  state.gamme
                              );
                              if (sig.notes.length === 0) {
                                  return (
                                      <p className="no-alterations">
                                          Aucune altération
                                      </p>
                                  );
                              }
                              const symbol = sig.type === "#" ? "♯" : "♭";
                              return (
                                  <div className="alterations-display">
                                      <span className="alteration-count">
                                          {sig.notes.length}
                                          {symbol}
                                      </span>
                                      <div className="alteration-notes">
                                          {sig.notes.map((note, i) => (
                                              <span
                                                  key={i}
                                                  className="alteration-note"
                                              >
                                                  {note}
                                                  {symbol}
                                              </span>
                                          ))}
                                      </div>
                                  </div>
                              );
                          })()}
                      </div>

                      {/* Affichage des substitutions par tons communs */}
                      <div className="common-tone-substitutions">
                          <h3>Substitutions (2 notes communes)</h3>
                          <div className="substitutions-grid">
                              {getCommonToneSubstitutions(
                                  state.tonalite,
                                  state.gamme
                              ).map((item, index) => (
                                  <div
                                      key={index}
                                      className="substitution-item"
                                  >
                                      <span className="sub-original">
                                          {item.original.chord}
                                      </span>
                                      <span className="sub-options">
                                          {item.substitutions
                                              .map((s) => s.chord)
                                              .join(", ")}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                  {state.lastUpdate && (
                      <p className="last-update">
                          Dernière mise à jour : {state.updatedBy} -{" "}
                          {new Date(state.lastUpdate).toLocaleTimeString()}
                      </p>
                  )}
              </section>

              {/* Section des musiciens connectés */}
              <section className="musicians-section">
                  <h3>Musiciens connectés ({musicians.length})</h3>
                  <ul className="musicians-list">
                      {musicians.map((musician) => (
                          <li
                              key={musician.id}
                              className={
                                  musician.name === musicianName
                                      ? "current-user"
                                      : ""
                              }
                          >
                              🎹 {musician.name}
                              {musician.name === musicianName && " (vous)"}
                          </li>
                      ))}
                  </ul>
              </section>

              {/* Section de chat (optionnelle) */}
              <section className="chat-section">
                  <h3>Messages</h3>
                  <div className="messages-container">
                      {messages.map((msg, index) => (
                          <div key={index} className="message">
                              <strong>{msg.from}:</strong> {msg.text}
                              <span className="message-time">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                          </div>
                      ))}
                  </div>
                  <form onSubmit={sendMessage} className="message-form">
                      <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Envoyer un message..."
                      />
                      <button type="submit">Envoyer</button>
                  </form>
              </section>
          </div>
      </div>
  );
}

export default App;
