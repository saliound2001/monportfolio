# Sama Hair Glow — Site E-commerce

Site e-commerce complet (huiles capillaires & voiles) avec panier, calcul automatique du total, et paiement mobile money (Orange Money / Wave).

## 📁 Structure du projet

```
sama-hair-glow/
├── frontend/              → Le site (HTML/CSS/JS, à héberger tel quel)
│   ├── index.html          Page d'accueil
│   ├── boutique.html       Catalogue avec filtres (huiles / voiles)
│   ├── produit.html        Fiche produit
│   ├── panier.html         Panier (calcul automatique du total)
│   ├── checkout.html       Paiement (Orange Money / Wave)
│   ├── confirmation.html   Confirmation de commande
│   ├── css/style.css
│   └── js/
│       ├── data.js         Catalogue produits
│       ├── cart.js         Moteur du panier
│       └── api.js          Connexion au backend
│
└── backend/                → API sécurisée (Node.js + Express + SQLite)
    ├── server.js
    ├── db/
    │   ├── database.js     Connexion + création des tables (requêtes préparées)
    │   └── seed.js         Remplissage initial des produits
    ├── routes/
    │   ├── produits.js
    │   ├── commandes.js     Création de commande (montants recalculés côté serveur)
    │   └── paiement.js      Intégration Orange Money & Wave
    └── .env.example
```

## 🔒 Sécurité mise en place

- **Protection contre les injections SQL** : toutes les requêtes utilisent des *prepared statements* (`db.prepare(...).run(?, ?, ?)`), jamais de concaténation de texte dans le SQL. Testé avec plusieurs tentatives d'injection (`' OR '1'='1`, `; DROP TABLE ...`) — aucune n'a fonctionné.
- **Validation des données** : chaque champ envoyé par le client est vérifié (téléphone, méthode de paiement, panier non vide...).
- **Montants recalculés côté serveur** : le total n'est jamais pris tel quel depuis le navigateur — il est recalculé à partir des prix réels en base, pour empêcher toute tentative de trafiquer le prix.
- **Limitation de débit (rate limiting)** : 60 requêtes/minute/IP pour limiter les abus.
- **CORS restreint** : seul le domaine du site pourra appeler l'API une fois configuré (`FRONTEND_URL` dans `.env`).

## ▶️ Lancer le site en local (pour tester)

**1. Backend :**
```bash
cd backend
npm install
cp .env.example .env
node server.js
```
→ API disponible sur `http://localhost:4000`

**2. Frontend :**
Ouvre `frontend/index.html` avec l'extension "Live Server" de VS Code, ou :
```bash
cd frontend
npx serve .
```
Puis modifie `frontend/js/api.js` si besoin (`API_BASE_URL`).

## 🚀 Mettre le site en ligne

Deux parties à héberger séparément :

### Frontend (le site)
Le dossier `frontend/` est un site statique. Options simples et gratuites/pas chères :
- **Netlify** ou **Vercel** : glisser-déposer le dossier `frontend/`, en 2 minutes c'est en ligne.
- Un hébergeur classique (o2switch, Hostinger...) avec upload FTP.

### Backend (l'API)
Le dossier `backend/` doit tourner sur un serveur Node.js en continu :
- **Render.com** ou **Railway.app** : connectent directement à un dépôt GitHub, gratuit pour démarrer.
- Ensuite configurer les variables d'environnement (`.env`) sur la plateforme choisie.

### Étapes une fois hébergé
1. Note l'URL du backend (ex : `https://sama-api.onrender.com`).
2. Dans `frontend/js/api.js`, remplace la ligne `API_BASE_URL` pour pointer vers cette URL.
3. Dans `backend/.env`, mets `FRONTEND_URL` = l'URL réelle du site (pour le CORS).
4. Achète un nom de domaine (ex : `samahairglow.com`) chez Namecheap, Google Domains ou un registrar sénégalais, et connecte-le à Netlify/Vercel.

## 💳 Activer les paiements réels (Orange Money & Wave)

Le code est déjà prêt dans `backend/routes/paiement.js` avec la structure exacte des appels API. Tant que les clés ne sont pas renseignées, le site fonctionne en **mode démo** (les commandes se créent normalement, sans vrai débit).

**Pour activer Orange Money :**
1. Créer un compte sur [developer.orange.com](https://developer.orange.com) → devenir marchand Orange Money.
2. Récupérer la clé API et la clé marchande.
3. Les renseigner dans `.env` : `ORANGE_MONEY_API_KEY`, `ORANGE_MONEY_MERCHANT_KEY`.

**Pour activer Wave :**
1. Créer un compte sur [business.wave.com](https://business.wave.com).
2. Récupérer la clé API dans le tableau de bord marchand.
3. La renseigner dans `.env` : `WAVE_API_KEY`.

Une fois ces clés ajoutées, le site basculera automatiquement en paiement réel — aucun changement de code nécessaire.

## ✅ Ce qui a été testé

- Navigation accueil → boutique → fiche produit → panier → checkout → confirmation
- Ajout/suppression/modification de quantité dans le panier, total recalculé automatiquement
- Filtres par catégorie (huiles / voiles)
- Création de commande côté API avec recalcul du total
- Tentatives d'injection SQL sur plusieurs endpoints (échouées, comme prévu)

## 📌 Prochaines étapes suggérées

- Remplacer les photos de démonstration par tes vraies photos produits
- Ajouter un espace "administration" pour gérer stock/commandes facilement
- Ajouter l'envoi de SMS/WhatsApp de confirmation automatique au client
