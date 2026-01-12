# 🎵 Concert Sync - Synchronisation en temps réel pour musiciens

Application de synchronisation en temps réel permettant à plusieurs musiciens de partager des informations pendant un concert (tempo, tonalité, structure, notes) sans connexion Internet.

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- Un appareil pour faire serveur (tablette, smartphone, ou Raspberry Pi)
- Tablettes pour les musiciens (iOS, Android, ou autre)
- Un réseau WiFi local (ou hotspot)

---

## 🚀 Installation

### 1️⃣ Télécharger le projet

```bash
# Cloner ou télécharger ce dossier
cd concert-sync
```

### 2️⃣ Installer le serveur

```bash
cd server
npm install
```

### 3️⃣ Installer le client

```bash
cd ../client
npm install
```

---

## 💻 Configuration

### Trouver l'adresse IP de l'appareil serveur

#### Sur Windows :
```bash
ipconfig
```
Cherchez "Adresse IPv4" (ex: `192.168.1.100`)

#### Sur Mac :
```bash
ifconfig | grep "inet "
```
Ou allez dans Préférences Système → Réseau

#### Sur Linux :
```bash
ip addr show
```
Cherchez l'IP de votre interface WiFi (ex: `192.168.1.100`)

### Configurer le client

1. Copiez `.env.example` vers `.env` dans le dossier `client/` :
```bash
cd client
cp .env.example .env
```

2. Éditez `.env` et remplacez l'IP :
```
REACT_APP_SOCKET_URL=http://192.168.1.100:3001
```
⚠️ Remplacez `192.168.1.100` par **votre IP locale réelle**

---

## 🎬 Démarrage

### Option A : Mode Développement (pour tester)

**Terminal 1 - Démarrer le serveur :**
```bash
cd server
npm start
```

**Terminal 2 - Démarrer le client :**
```bash
cd client
npm start
```

Le client s'ouvrira automatiquement sur `http://localhost:3000`

### Option B : Mode Production (recommandé pour concerts)

**1. Builder le client :**
```bash
cd client
npm run build
```

**2. Démarrer uniquement le serveur (qui servira aussi le client) :**
```bash
cd ../server
npm start
```

**3. Accès :**
- Sur l'appareil serveur : `http://localhost:3001`
- Sur les autres tablettes : `http://[IP-DU-SERVEUR]:3001`
  
Exemple : `http://192.168.1.100:3001`

---

## 📱 Utilisation sur les tablettes

### Setup initial

1. **Créer un hotspot WiFi** sur l'appareil serveur OU connecter tous les appareils au même réseau WiFi
   
2. **Sur l'appareil serveur** (celui qui fait tourner Node.js) :
   - Démarrer le serveur : `npm start` dans le dossier `server/`
   - Noter l'IP affichée dans le terminal

3. **Sur chaque tablette de musicien** :
   - Ouvrir le navigateur (Safari, Chrome, etc.)
   - Aller à : `http://[IP-DU-SERVEUR]:3001`
   - Entrer votre nom (ex: "Marc - Piano")
   - Cliquer sur "Rejoindre le concert"

### Pendant le concert

- **N'importe quel musicien** peut modifier le tempo, la tonalité, la structure ou les notes
- Les changements sont **instantanément synchronisés** sur toutes les tablettes
- Vous voyez qui est connecté dans la section "Musiciens connectés"
- Vous pouvez envoyer des messages rapides via le chat

### Ajout à l'écran d'accueil (PWA)

Pour un accès rapide comme une vraie app :

**Sur iOS (Safari) :**
1. Appuyez sur le bouton "Partager" 
2. Sélectionnez "Sur l'écran d'accueil"
3. Confirmez

**Sur Android (Chrome) :**
1. Menu (⋮) → "Ajouter à l'écran d'accueil"
2. Confirmez

---

## 🛠 Configuration avancée

### Changer le port du serveur

Dans `server/server.js`, modifiez la ligne :
```javascript
const PORT = process.env.PORT || 3001;
```

### Ajouter des paramètres personnalisés

Dans `client/src/App.js`, vous pouvez facilement ajouter de nouveaux champs à synchroniser :

1. Ajoutez la propriété dans l'état initial
2. Ajoutez le champ dans le JSX
3. C'est tout ! La synchronisation est automatique

Exemple - Ajouter un champ "Nuance" :
```javascript
// Dans l'état initial
const [state, setState] = useState({
  tempo: 120,
  tonalite: 'C',
  structure: 'Intro',
  nuance: 'mf',  // ← Nouveau champ
  notes: '',
  // ...
});

// Dans le JSX (section controls)
<label>
  Nuance
  <select
    value={state.nuance}
    onChange={(e) => updateState('nuance', e.target.value)}
  >
    <option value="pp">pp</option>
    <option value="p">p</option>
    <option value="mp">mp</option>
    <option value="mf">mf</option>
    <option value="f">f</option>
    <option value="ff">ff</option>
  </select>
</label>
```

---

## 🔧 Dépannage

### Le serveur ne démarre pas
- Vérifiez que Node.js est bien installé : `node --version`
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Relancez `npm install` dans le dossier `server/`

### Les tablettes ne se connectent pas
- Vérifiez que tous les appareils sont sur le **même réseau WiFi**
- Vérifiez l'adresse IP dans le `.env` du client
- Vérifiez que le firewall ne bloque pas le port 3001
- Sur l'appareil serveur, testez d'abord `http://localhost:3001` pour voir si ça marche localement

### La synchronisation ne fonctionne pas
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que le serveur est bien démarré
- Rechargez la page sur les tablettes

### Latence importante
- Vérifiez la qualité du signal WiFi
- Réduisez la distance entre les appareils et le routeur/hotspot
- Limitez le nombre d'appareils connectés au réseau

---

## 📦 Déploiement sur appareil dédié

### Sur Raspberry Pi

1. **Installer Node.js** :
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Copier les fichiers** du projet sur le Pi

3. **Installer et démarrer** :
```bash
cd concert-sync/server
npm install
npm start
```

4. **Démarrage automatique** (optionnel) :
Créer un service systemd pour que ça démarre au boot du Pi.

### Sur tablette Android (Termux)

1. Installer Termux depuis F-Droid
2. Dans Termux :
```bash
pkg install nodejs
cd /sdcard
# Copier les fichiers du projet ici
cd concert-sync/server
npm install
npm start
```

---

## 🎯 Fonctionnalités

✅ Synchronisation en temps réel sans Internet  
✅ Interface tactile optimisée pour tablettes  
✅ Tempo, tonalité, structure de morceau  
✅ Notes partagées entre musiciens  
✅ Liste des musiciens connectés  
✅ Chat intégré  
✅ Design responsive  
✅ Reconnexion automatique  
✅ Latence minimale (<100ms)  

---

## 🎨 Personnalisation

Le design est entièrement personnalisable dans `client/src/App.css`. Vous pouvez :
- Changer les couleurs (actuellement violet/bleu)
- Adapter la taille des boutons pour scène
- Ajouter un mode nuit
- Augmenter la taille du texte

---

## 📝 Licence

MIT - Libre d'utilisation et de modification

---

## 🙋 Support

Pour toute question ou problème :
1. Vérifiez la section **Dépannage** ci-dessus
2. Consultez la console du navigateur (F12) pour les erreurs
3. Vérifiez les logs du serveur dans le terminal

---

## 🚀 Améliorations futures possibles

- [ ] Mode sombre
- [ ] Historique des changements
- [ ] Presets de morceaux
- [ ] Métronome visuel intégré
- [ ] Enregistrement de setlists
- [ ] Notifications push
- [ ] Gestion de plusieurs groupes simultanés

---

**Bon concert ! 🎵🎸🎹🎤**
