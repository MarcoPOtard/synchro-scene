import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
  `http://${window.location.hostname}:3001`;

const INITIAL_STATE = {
  style: 'Pop',
  tonalite: 'C',
  gamme: 'Majeur',
  notes: '',
  lastUpdate: null,
  updatedBy: null,
  displayChange: 'acc-alt-sub-gri',
};

export const useSocket = () => {
  const [socket, setSocket]               = useState(null);
  const [connected, setConnected]         = useState(false);
  const [musicianName, setMusicianName]   = useState('');
  const [registered, setRegistered]       = useState(false);
  const [state, setState]                 = useState(INITIAL_STATE);
  const [musicians, setMusicians]         = useState([]);
  const [messages, setMessages]           = useState([]);
  const [messageInput, setMessageInput]   = useState('');

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    newSocket.on('connect',    () => { console.log('✅ Connecté au serveur');    setConnected(true);  });
    newSocket.on('disconnect', () => { console.log('❌ Déconnecté du serveur'); setConnected(false); });

    newSocket.on('initial-state', (initialState) => {
      console.log('📥 État initial reçu:', initialState);
      setState(initialState);
    });

    newSocket.on('state-updated', (updatedState) => {
      console.log('🔄 État mis à jour:', updatedState);
      setState(updatedState);
      console.log('🔔', `Mis à jour par ${updatedState.updatedBy}`);
    });

    newSocket.on('musicians-list', (musiciansList) => {
      console.log('👥 Musiciens connectés:', musiciansList);
      setMusicians(musiciansList);
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (musicianName.trim() && socket) {
      socket.emit('register-musician', musicianName.trim());
      setRegistered(true);
      localStorage.setItem('musicianName', musicianName.trim());
    }
  };

  const updateState = (key, value) => {
    if (!socket || !connected) return;
    const update = { [key]: value };
    setState(prev => ({ ...prev, ...update }));
    socket.emit('update-state', update);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socket) {
      socket.emit('send-message', messageInput.trim());
      setMessageInput('');
    }
  };

  return {
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
  };
};
