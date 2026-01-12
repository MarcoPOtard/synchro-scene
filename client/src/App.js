import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Configuration de la connexion Socket.io
// En production, remplacer par l'IP du serveur local
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [musicianName, setMusicianName] = useState('');
  const [registered, setRegistered] = useState(false);
  
  // État partagé
  const [state, setState] = useState({
    tempo: 120,
    tonalite: 'C',
    structure: 'Intro',
    notes: '',
    lastUpdate: null,
    updatedBy: null
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
        <div className="header-info">
          <span className="musician-name">👤 {musicianName}</span>
          <span className={`connection-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢' : '🔴'}
          </span>
        </div>
      </header>

      <div className="main-content">
        {/* Section des contrôles principaux */}
        <section className="controls-section">
          <h2>Paramètres du morceau</h2>
          
          <div className="control-group">
            <label>
              Tempo (BPM)
              <input
                type="number"
                value={state.tempo}
                onChange={(e) => updateState('tempo', parseInt(e.target.value) || 120)}
                min="40"
                max="240"
              />
            </label>
            
            <label>
              Tonalité
              <select
                value={state.tonalite}
                onChange={(e) => updateState('tonalite', e.target.value)}
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
              Structure
              <select
                value={state.structure}
                onChange={(e) => updateState('structure', e.target.value)}
              >
                <option value="Intro">Intro</option>
                <option value="Couplet">Couplet</option>
                <option value="Refrain">Refrain</option>
                <option value="Pont">Pont</option>
                <option value="Solo">Solo</option>
                <option value="Outro">Outro</option>
                <option value="Pause">Pause</option>
              </select>
            </label>
          </div>

          <div className="control-group full-width">
            <label>
              Notes / Instructions
              <textarea
                value={state.notes}
                onChange={(e) => updateState('notes', e.target.value)}
                placeholder="Notes partagées, instructions, changements..."
                rows="3"
              />
            </label>
          </div>

          {state.lastUpdate && (
            <p className="last-update">
              Dernière mise à jour : {state.updatedBy} - {new Date(state.lastUpdate).toLocaleTimeString()}
            </p>
          )}
        </section>

        {/* Section des musiciens connectés */}
        <section className="musicians-section">
          <h3>Musiciens connectés ({musicians.length})</h3>
          <ul className="musicians-list">
            {musicians.map((musician) => (
              <li key={musician.id} className={musician.name === musicianName ? 'current-user' : ''}>
                🎹 {musician.name}
                {musician.name === musicianName && ' (vous)'}
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
