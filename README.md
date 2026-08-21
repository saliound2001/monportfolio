# Portfolio — README

## Structure
```
portfolio/
├── index.html              # Page principale
├── css/style.css           # Styles (thème sombre bleu/cyan)
├── js/script.js            # Interactions (menu, typewriter, animations, envoi du formulaire)
├── php/contact.php         # Traitement du formulaire de contact (mail())
└── assets/
    ├── img/                # Placeholders SVG à remplacer par tes vraies images
    └── CV.pdf              # À ajouter : ton CV en PDF (référencé par le bouton "Télécharger CV")
```

## À personnaliser avant le rendu
1. **index.html**
   - Remplace `Ton Nom`, `TonAlias`, le texte "À propos", le parcours académique.
   - Remplace les 3 cartes projets (titres, descriptions, technos, liens réels).
   - Mets à jour les coordonnées (téléphone, email, liens réseaux sociaux).
2. **assets/img/**
   - Remplace `profil-placeholder.svg` par ta vraie photo (garde le même nom de fichier ou mets à jour le `src` dans le HTML).
   - Remplace les 3 `projet-*-placeholder.svg` par des captures d'écran réelles.
3. **assets/CV.pdf**
   - Ajoute ton CV à cet emplacement (le bouton "Télécharger CV" pointe déjà dessus).
4. **php/contact.php**
   - Change `$destinataire` par ta vraie adresse email.

## Tester en local (avec PHP)
Le formulaire de contact nécessite un serveur PHP pour fonctionner (la fonction `mail()` ne marche pas avec un simple double-clic sur le fichier HTML) :

```bash
cd portfolio
php -S localhost:8000
```
Puis ouvre `http://localhost:8000` dans ton navigateur.

⚠️ En local, `mail()` échoue généralement car aucun serveur SMTP n'est configuré sur ta machine — c'est normal. Le formulaire fonctionnera une fois déployé sur un hébergement qui supporte `mail()` (ou PHPMailer/SMTP).

## Déployer (le sujet d'examen demande un déploiement, pas juste du local)
Comme le projet utilise PHP, GitHub Pages ne suffit pas (il ne sert que du HTML/CSS/JS statique). Options simples et gratuites :
- **InfinityFree** ou **000webhost** : hébergement mutualisé gratuit avec PHP + `mail()`.
- **Railway** / **Render** : déploiement via Git, supporte PHP avec un buildpack.
- Héberger uniquement la partie statique sur GitHub Pages et faire pointer le formulaire vers un petit backend PHP hébergé ailleurs (ex. InfinityFree) — utile si tu veux garder GitHub Pages pour la vitrine.

## Prochaines améliorations possibles
- Remplacer `mail()` par PHPMailer + SMTP pour une délivrabilité fiable en production.
- Ajouter un champ honeypot caché (`<input type="text" name="website" style="display:none">`) dans le formulaire pour renforcer l'anti-spam déjà prévu côté PHP.
