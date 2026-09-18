# 🚀 Démarrage Rapide - Concert Sync

## Pour tester localement (5 minutes)

```bash
# Terminal 1
cd server && npm install && npm start

# Terminal 2
cd client && npm install && npm run dev
```

- Ouvrez plusieurs onglets sur `http://localhost:3000`
- Entrez un nom différent dans chaque onglet
- Testez la synchronisation !

---

## Pour un vrai concert

Le serveur est déployé **une seule fois** sur Render — plus besoin de le relancer ni de chercher une IP avant chaque concert. Voir le README pour le déploiement initial.

### Checklist avant concert

- [ ] Le service Render a été réveillé au moins 1 minute avant (plan Free : il se met en veille après inactivité)
- [ ] Chaque musicien a une connexion Internet (4G/5G ou WiFi) sur son appareil
- [ ] Testé avec 2-3 appareils avant le concert
- [ ] Tablettes/téléphones chargés

### Sur les tablettes

1. Un musicien déjà connecté ouvre **📱 Inviter** dans l'appli → un QR code s'affiche.
2. Chaque nouveau musicien scanne ce QR avec l'appareil photo de son téléphone — ça ouvre l'appli directement.
3. Il entre son nom et clique sur "Rejoindre le concert".

---

## Aide rapide

**Pas de synchronisation ?**
→ Rechargez la page
→ Vérifiez que le service Render est "Live" dans le dashboard

**Connexion lente à la 1ère ouverture ?**
→ Normal sur le plan Free si le service était en veille (20-30s de réveil)

---

**Besoin d'aide ?** Consultez le README.md complet !
