const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configuration CORS pour permettre les connexions depuis n'importe quelle tablette
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du client
app.use(express.static(path.join(__dirname, '../client/build')));

// Configuration Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// État partagé entre tous les musiciens
let sharedState = {
  tempo: 120,
  tonalite: 'C',
  structure: 'Intro',
  notes: '',
  lastUpdate: null,
  updatedBy: null
};

// Stockage des musiciens connectés
let connectedMusicians = new Map();

io.on('connection', (socket) => {
  console.log(`✅ Nouvelle connexion : ${socket.id}`);
  
  // Envoyer l'état actuel au nouveau connecté
  socket.emit('initial-state', sharedState);
  
  // Envoyer la liste des musiciens connectés
  socket.emit('musicians-list', Array.from(connectedMusicians.values()));

  // Enregistrement d'un musicien
  socket.on('register-musician', (musicianName) => {
    connectedMusicians.set(socket.id, {
      id: socket.id,
      name: musicianName,
      connectedAt: new Date().toISOString()
    });
    console.log(`🎵 Musicien enregistré : ${musicianName} (${socket.id})`);
    
    // Notifier tous les clients de la nouvelle liste
    io.emit('musicians-list', Array.from(connectedMusicians.values()));
  });

  // Réception d'une mise à jour d'état
  socket.on('update-state', (data) => {
    const musician = connectedMusicians.get(socket.id);
    
    // Mettre à jour l'état partagé
    sharedState = {
      ...sharedState,
      ...data,
      lastUpdate: new Date().toISOString(),
      updatedBy: musician ? musician.name : 'Inconnu'
    };
    
    console.log(`📡 Mise à jour de ${sharedState.updatedBy}:`, data);
    
    // Broadcaster la mise à jour à tous les clients (sauf l'émetteur)
    socket.broadcast.emit('state-updated', sharedState);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    const musician = connectedMusicians.get(socket.id);
    if (musician) {
      console.log(`❌ Déconnexion : ${musician.name} (${socket.id})`);
      connectedMusicians.delete(socket.id);
      
      // Notifier les autres de la déconnexion
      io.emit('musicians-list', Array.from(connectedMusicians.values()));
    } else {
      console.log(`❌ Déconnexion : ${socket.id}`);
    }
  });

  // Message de chat entre musiciens (bonus)
  socket.on('send-message', (message) => {
    const musician = connectedMusicians.get(socket.id);
    const messageData = {
      from: musician ? musician.name : 'Inconnu',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    console.log(`💬 Message de ${messageData.from}: ${message}`);
    io.emit('new-message', messageData);
  });
});

// Route de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedMusicians: connectedMusicians.size,
    uptime: process.uptime()
  });
});

// Pour le mode production : servir le client React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🎸 ================================');
  console.log('🎵 SERVEUR DE SYNC CONCERT DÉMARRÉ');
  console.log('🎸 ================================\n');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Accès local: http://localhost:${PORT}`);
  console.log(`🌐 Accès réseau: http://[VOTRE-IP-LOCALE]:${PORT}`);
  console.log('\n💡 Pour trouver votre IP locale:');
  console.log('   - Windows: ipconfig');
  console.log('   - Mac/Linux: ifconfig ou ip addr\n');
  console.log('🎹 Prêt à synchroniser les musiciens!\n');
});
