# Sierre–Zinal Live

Dashboard mobile de suivi de la Sierre–Zinal 2026 d’Estelle Chauveau, dossard 8537.

## Fonctions

- accès direct à la fiche Datasport d’Estelle et au classement live ;
- chronomètre et progression théorique sur l’objectif 4 h 15 ;
- plan spectateur Sierre → Chandolin → Mottec → Zinal ;
- carte Leaflet/OpenStreetMap avec GPX de la course et itinéraire routier ;
- passages prévus, plan d’effort et document PDF source ;
- météo dynamique Sierre, Chandolin et Zinal ;
- checklist locale et PWA utilisable hors connexion.

## Développement

```bash
npm ci
npm run dev
npm run check
```

Le site est construit avec React, TypeScript et Vite. Le déploiement GitHub Pages est automatique après fusion sur `main`.

## Données

Le tracé provient du GPX Strava fourni pour la course. Fond de carte © contributeurs OpenStreetMap. Prévisions météorologiques Open-Meteo. Horaires et restrictions : organisation Sierre-Zinal 2026.
