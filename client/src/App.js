import React from 'react';
import './App.css';

import { useSocket } from './hooks/useSocket';
import RegisterScreen from './components/RegisterScreen';
import ScaleChords from './components/ScaleChords';
import KeySignature from './components/KeySignature';
import CommonToneSubstitutions from './components/CommonToneSubstitutions';
import StyleProgression from './components/StyleProgression';
import MusiciansList from './components/MusiciansList';
import Chat from './components/Chat';

function App() {
  const {
    connected,
    musicianName, setMusicianName,
    registered,
    state,
    musicians,
    messages,
    messageInput, setMessageInput,
    handleRegister,
    updateState,
    sendMessage,
  } = useSocket();

  if (!registered) {
    return (
      <RegisterScreen
        connected={connected}
        musicianName={musicianName}
        setMusicianName={setMusicianName}
        handleRegister={handleRegister}
      />
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎵 Comédie Musicale Improvisée</h1>
        <select
          className="app-header__display-change"
          name="display-change"
          value={state.displayChange}
          onChange={(e) => updateState('displayChange', e.target.value)}
        >
          <option value="acc-alt-sub-gri">Accords — Altérations — Substitutions — Grille</option>
          <option value="acc-alt-gri-sub">Accords — Altérations — Grille — Substitutions</option>
          <option value="acc-sub-alt-gri">Accords — Substitutions — Altérations — Grille</option>
          <option value="acc-sub-gri-alt">Accords — Substitutions — Grille — Altérations</option>
          <option value="acc-gri-alt-sub">Accords — Grille — Altérations — Substitutions</option>
          <option value="acc-gri-sub-alt">Accords — Grille — Substitutions — Altérations</option>
          <option value="alt-acc-sub-gri">Altérations — Accords — Substitutions — Grille</option>
          <option value="alt-acc-gri-sub">Altérations — Accords — Grille — Substitutions</option>
          <option value="alt-sub-acc-gri">Altérations — Substitutions — Accords — Grille</option>
          <option value="alt-sub-gri-acc">Altérations — Substitutions — Grille — Accords</option>
          <option value="alt-gri-acc-sub">Altérations — Grille — Accords — Substitutions</option>
          <option value="alt-gri-sub-acc">Altérations — Grille — Substitutions — Accords</option>
          <option value="sub-acc-alt-gri">Substitutions — Accords — Altérations — Grille</option>
          <option value="sub-acc-gri-alt">Substitutions — Accords — Grille — Altérations</option>
          <option value="sub-alt-acc-gri">Substitutions — Altérations — Accords — Grille</option>
          <option value="sub-alt-gri-acc">Substitutions — Altérations — Grille — Accords</option>
          <option value="sub-gri-acc-alt">Substitutions — Grille — Accords — Altérations</option>
          <option value="sub-gri-alt-acc">Substitutions — Grille — Altérations — Accords</option>
          <option value="gri-acc-alt-sub">Grille — Accords — Altérations — Substitutions</option>
          <option value="gri-acc-sub-alt">Grille — Accords — Substitutions — Altérations</option>
          <option value="gri-alt-acc-sub">Grille — Altérations — Accords — Substitutions</option>
          <option value="gri-alt-sub-acc">Grille — Altérations — Substitutions — Accords</option>
          <option value="gri-sub-acc-alt">Grille — Substitutions — Accords — Altérations</option>
          <option value="gri-sub-alt-acc">Grille — Substitutions — Altérations — Accords</option>
        </select>
        <div className="header-info">
          <span className="musician-name">👤 {musicianName}</span>
          <span className={`connection-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢' : '🔴'}
          </span>
        </div>
      </header>

      <div className="main-content">
        <section className="controls-section">
          <h2>Paramètres du morceau</h2>

          <div className="control-group">
            <label>
              Tonalité
              <select value={state.tonalite} onChange={(e) => updateState('tonalite', e.target.value)}>
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
              <select value={state.gamme} onChange={(e) => updateState('gamme', e.target.value)}>
                <option value="Majeur">Majeur</option>
                <option value="mineur naturelle">mineur naturelle</option>
                <option value="mineur harmonique">mineur harmonique</option>
                <option value="mineur mélodique">mineur mélodique</option>
              </select>
            </label>

            <label>
              Style
              <select value={state.style} onChange={(e) => updateState('style', e.target.value)}>
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
                onChange={(e) => updateState('notes', e.target.value)}
                placeholder="Notes partagées, instructions, changements..."
                rows="2"
              />
            </label>
          </div>

          {(() => {
            const order = Object.fromEntries(
              state.displayChange.split('-').map((key, idx) => [key, idx + 1])
            );
            return (
              <div className="display-change">
                <ScaleChords           style={{ order: order.acc }} tonalite={state.tonalite} gamme={state.gamme} />
                <KeySignature          style={{ order: order.alt }} tonalite={state.tonalite} gamme={state.gamme} />
                <CommonToneSubstitutions style={{ order: order.sub }} tonalite={state.tonalite} gamme={state.gamme} />
                <StyleProgression      style={{ order: order.gri }} musicStyle={state.style} tonalite={state.tonalite} gamme={state.gamme} />
              </div>
            );
          })()}

          {state.lastUpdate && (
            <p className="last-update">
              Dernière mise à jour : {state.updatedBy} —{' '}
              {new Date(state.lastUpdate).toLocaleTimeString()}
            </p>
          )}
        </section>

        <MusiciansList musicians={musicians} musicianName={musicianName} />
        <Chat
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
