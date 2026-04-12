import React from 'react';

const RegisterScreen = ({ connected, musicianName, setMusicianName, handleRegister }) => (
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

export default RegisterScreen;
