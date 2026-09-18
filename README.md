# 🎵 Concert Sync - Synchronisation en temps réel pour musiciens

Application de synchronisation en temps réel permettant à plusieurs musiciens de partager des informations pendant un concert (tempo, tonalité, structure, notes), même quand chacun n'a que sa propre connexion 4G/5G (pas besoin d'un WiFi commun).

Le serveur est déployé **une seule fois** sur un hébergeur cloud (Render) et tourne en permanence. Il n'y a donc plus rien à installer ni à lancer avant un concert : chaque musicien ouvre simplement une URL (ou scanne un QR code) sur son téléphone/tablette.

## 📋 Prérequis

- Une connexion Internet sur chaque appareil (4G/5G ou WiFi, peu importe qu'ils soient sur le même réseau)
- Un navigateur récent (Safari, Chrome, ...) sur chaque appareil des musiciens
- **Node.js** (version 16+) uniquement si vous développez/testez en local — [Télécharger ici](https://nodejs.org/)

---

## ☁️ Déploiement (une seule fois)

### Sur Render

1. Poussez ce repo sur GitHub (déjà fait si vous lisez ceci depuis le dépôt).
2. Sur [render.com](https://render.com), créez un **New → Web Service** et connectez ce repo. Render détecte le `render.yaml` à la racine et pré-remplit :
   - **Build Command** : `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command** : `node server/server.js`
   - **Plan** : Free (suffisant pour commencer — voir la note ci-dessous)
3. Déployez. Render vous donne une URL fixe du type `https://synchro-scene.onrender.com`.

⚠️ **Tier gratuit** : le service se met en veille après ~15 min d'inactivité. La première connexion après une veille peut prendre 20-30 secondes. Pensez à ouvrir l'appli quelques minutes avant de monter sur scène. Si ça devient gênant, passez sur le plan payant Starter (~7$/mois) pour un service toujours actif — aucun changement de code nécessaire.

C'est tout : cette URL ne change plus, vous n'avez plus jamais besoin de relancer un serveur ou de chercher une IP.

---

## 📱 Utilisation en concert

1. Un musicien déjà connecté ouvre le menu **📱 Inviter** dans l'appli (visible sur l'écran de connexion et dans l'en-tête) : ça affiche un QR code qui encode l'URL Render.
2. Chaque nouveau musicien scanne ce QR code avec l'appareil photo de son téléphone/tablette — ça ouvre directement l'appli dans le navigateur.
3. Il entre son nom (ex: "Marc - Piano") et clique sur "Rejoindre le concert".

### Pendant le concert

- **N'importe quel musicien** peut modifier le tempo, la tonalité, la structure ou les notes
- Les changements sont **instantanément synchronisés** sur tous les appareils
- Vous voyez qui est connecté dans la section "Musiciens connectés"
- Vous pouvez envoyer des messages rapides via le chat

### Ajout à l'écran d'accueil (PWA)

Pour un accès rapide comme une vraie app, sans repasser par le QR code à chaque fois :

**Sur iOS (Safari) :**
1. Appuyez sur le bouton "Partager" 
2. Sélectionnez "Sur l'écran d'accueil"
3. Confirmez

**Sur Android (Chrome) :**
1. Menu (⋮) → "Ajouter à l'écran d'accueil"
2. Confirmez

---

## 🧪 Développement local

Pour tester en local avant de déployer :

**1. Installer les dépendances :**
```bash
cd server && npm install
cd ../client && npm install
```

**2. Configurer le client** (uniquement en dev — inutile en production, le client se connecte automatiquement au serveur qui le sert) :
```bash
cd client
cp .env.example .env
```
`.env` pointe par défaut vers `http://localhost:3001`.

**3. Lancer les deux (deux terminaux) :**
```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm run dev
```

Le client s'ouvre sur `http://localhost:3000`.

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

### Le service Render ne répond pas / met du temps
- Sur le plan Free, un service inactif ~15 min se met en veille : la 1ère requête le réveille (20-30s). Ouvrez l'appli quelques minutes avant le concert.
- Vérifiez le statut et les logs du service dans le dashboard Render.

### Une tablette n'arrive pas à se connecter
- Vérifiez qu'elle a bien une connexion Internet (4G/5G ou WiFi) active.
- Vérifiez que l'URL scannée/ouverte est bien la bonne (celle donnée par Render).
- Ouvrez la console du navigateur (F12 ou outils développeur mobile) pour voir les erreurs.

### La synchronisation ne fonctionne pas
- Rechargez la page.
- Vérifiez dans le dashboard Render que le service est bien "Live" (pas en train de redémarrer).

### Latence importante
- La latence dépend de la qualité du réseau mobile de chaque musicien plutôt que d'un WiFi local — un signal 4G/5G faible sur un appareil ralentit sa propre synchronisation.

---

## 🎯 Fonctionnalités

✅ Synchronisation en temps réel entre musiciens, chacun sur sa propre connexion (4G/5G ou WiFi)  
✅ Rejoindre en scannant un QR code, sans IP à chercher ni serveur à lancer  
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
