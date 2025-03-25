
# StationManager - Application de Gestion de Stations-Service

## Présentation du Projet

### Contexte
StationManager a été créé pour répondre au besoin croissant d'automatisation et de digitalisation des processus de gestion des stations-service. Face à la complexité grandissante de la gestion quotidienne (employés, stocks, ventes, maintenance), ce logiciel offre une solution centralisée et intuitive.

### Objectifs Principaux
- Automatiser la gestion des stations-service et réduire les erreurs humaines
- Centraliser les données et faciliter l'accès aux informations importantes
- Optimiser la gestion des employés et des plannings
- Améliorer le suivi des ventes et la gestion des stocks
- Faciliter la génération de rapports et l'analyse des données
- Augmenter l'efficacité opérationnelle globale

### Méthodologie et Technologies Utilisées
- **Frontend**: React.js, Typescript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Base de données**: MongoDB
- **Outils supplémentaires**: Git pour le versioning, npm pour la gestion des packages

## Installation et Lancement du Projet

### Prérequis
- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- MongoDB (compte Atlas ou installation locale)

### Installation

1. Extraire le fichier ZIP dans le dossier de votre choix

2. Installer les dépendances frontend
```bash
# Dans le dossier racine du projet
npm install
```

3. Installer les dépendances backend
```bash
# Dans le dossier backend
cd backend
npm install
```

4. Configurer les variables d'environnement
   - Renommer le fichier `.env.example` en `.env` dans le dossier backend
   - Configurer votre URL MongoDB et autres paramètres dans ce fichier

### Lancement de l'Application

1. Démarrer le serveur backend
```bash
# Dans le dossier backend
cd backend
npm start
# Ou
node server.js
```

2. Dans un autre terminal, démarrer l'application frontend
```bash
# Dans le dossier racine
npm run dev
```

3. Accéder à l'application
   - Le frontend sera disponible à l'adresse: http://localhost:5173
   - L'API backend sera disponible à l'adresse: http://localhost:5000

## Structure du Projet

```
stationmanager/
├── backend/              # Code serveur Express.js
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes API
│   ├── .env              # Variables d'environnement
│   └── server.js         # Point d'entrée du serveur
├── public/               # Ressources statiques
├── src/                  # Code source frontend
│   ├── components/       # Composants React réutilisables
│   ├── contexts/         # Contextes React (authentification, etc.)
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services pour les appels API
│   └── types/            # Définitions TypeScript
└── package.json          # Dépendances et scripts
```

## Utilisation

1. Se connecter avec un compte administrateur (par défaut: admin@example.com / password)
2. Naviguer dans les différentes sections via le menu latéral
3. Gérer les stations, employés, stocks, ventes et générer des rapports

## Contact

Pour toute question ou assistance, veuillez contacter l'administrateur système.
