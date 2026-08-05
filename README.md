# Sierre–Zinal Live

Outil terrain mobile pour suivre Estelle Chauveau (dossard 8537) et rejoindre l’arrivée de Sierre–Zinal 2026.

## Fonctions

- état de la course, prochaine action et accès direct Datasport ;
- alerte circulation critique et planning Sierre → Zwissig → Mottec → Zinal ;
- trajet voiture Zwissig → Mottec (23,9 km, 25–30 min hors trafic, budget événement 45–60 min) ;
- carte Leaflet avec route voiture embarquée hors ligne et tracé GPX de la course ;
- passages théoriques sur l’objectif 4 h 15 et liens opérationnels.

## Développement

```bash
npm ci
npm run dev
npm run check
```

Le site utilise React, TypeScript, Vite et une PWA. Le déploiement GitHub Pages est automatique après fusion sur `main`.

## Données

Le tracé voiture embarqué a été calculé avec OSRM depuis Zwissig jusqu’à Mottec. Le tracé course provient du GPX Strava fourni. Fond de carte © contributeurs OpenStreetMap. Horaires, navettes et restrictions : organisation Sierre-Zinal 2026.
