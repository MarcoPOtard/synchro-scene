# 🚀 Démarrage Rapide - Concert Sync

## Pour tester localement (5 minutes)

### 1. Installation

```bash
# Dans le dossier server
cd server
npm install

# Dans le dossier client
cd ../client
npm install
```

### 2. Démarrage

**Terminal 1 :**
```bash
cd server
npm start
```

**Terminal 2 :**
```bash
cd client
npm start
```

### 3. Test
- Ouvrez plusieurs onglets sur `http://localhost:3000`
- Entrez un nom différent dans chaque onglet
- Testez la synchronisation !

---

## Pour un vrai concert (15 minutes)

### 1. Préparer l'appareil serveur

```bash
# Installer les dépendances
cd server
npm install

cd ../client
npm install

# Builder le client pour production
npm run build
```

### 2. Trouver votre IP locale

**Windows :** `ipconfig` → cherchez "IPv4"  
**Mac :** Préférences Système → Réseau  
**Linux :** `ip addr show`

Exemple : `192.168.1.100`

### 3. Configurer le client

```bash
cd client
cp .env.example .env
# Éditez .env et mettez votre IP :
# REACT_APP_SOCKET_URL=http://192.168.1.100:3001
```

### 4. Rebuilder avec la bonne config

```bash
npm run build
```

### 5. Démarrer le serveur

```bash
cd ../server
npm start
```

### 6. Sur les tablettes

1. Connectez toutes les tablettes au même WiFi
2. Ouvrez : `http://192.168.1.100:3001` (votre IP)
3. Entrez votre nom de musicien
4. C'est prêt !

---

## Checklist avant concert

- [ ] Node.js installé sur l'appareil serveur
- [ ] Projet installé et buildé
- [ ] IP locale notée
- [ ] Hotspot WiFi ou réseau WiFi disponible
- [ ] Testé avec 2-3 appareils avant le concert
- [ ] Tablettes chargées
- [ ] Appareil serveur branché sur secteur

---

## Aide rapide

**Problème de connexion ?**
→ Vérifiez que tous les appareils sont sur le même réseau WiFi
→ Vérifiez l'IP dans l'URL

**Pas de synchronisation ?**
→ Rechargez la page
→ Vérifiez que le serveur tourne

**Serveur ne démarre pas ?**
→ Vérifiez que le port 3001 est libre
→ Relancez `npm install`

---

**Besoin d'aide ?** Consultez le README.md complet !
