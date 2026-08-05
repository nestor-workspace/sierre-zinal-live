export const RACE_START = new Date('2026-08-08T11:10:00+02:00')
export const PLANNED_FINISH = new Date('2026-08-08T15:25:00+02:00')

export const links = {
  estelle: 'https://datasport.com/fr/course/sierre-zinal-2026/participant/chauveau-estelle',
  ranking: 'https://datasport.com/fr/course/sierre-zinal-2026/ranking',
  live: 'https://www.sierre-zinal.com/fr/live-127.html',
  traffic: 'https://www.sierre-zinal.com/fr/restrictions-circulation-2887.html',
  access: 'https://www.sierre-zinal.com/fr/acces-parkings-415.html',
  mottec: 'https://www.sierre-zinal.com/fr/parking-acces-zinal-2884.html',
  spectator: 'https://www.sierre-zinal.com/fr/voir-course-382.html',
} as const

export type Checkpoint = {
  name: string
  km: number
  elevation: number
  offsetMinutes: number
  time: string
  lat: number
  lon: number
  role?: 'start' | 'spectator' | 'finish'
}

export const checkpoints: Checkpoint[] = [
  { name: 'Sierre', km: 0, elevation: 585, offsetMinutes: 0, time: '11:10', lat: 46.28961, lon: 7.56466, role: 'start' },
  { name: 'Km 4', km: 4, elevation: 1600, offsetMinutes: 30, time: '11:40', lat: 46.27479, lon: 7.56381 },
  { name: 'Km 8', km: 8, elevation: 1936, offsetMinutes: 80, time: '12:30', lat: 46.26948, lon: 7.59761 },
  { name: 'Chandolin', km: 11, elevation: 2000, offsetMinutes: 110, time: '13:00', lat: 46.25173, lon: 7.59949, role: 'spectator' },
  { name: 'Tignousa', km: 16, elevation: 2210, offsetMinutes: 155, time: '13:45', lat: 46.22298, lon: 7.62266 },
  { name: 'Weisshorn', km: 19.5, elevation: 2425, offsetMinutes: 185, time: '14:15', lat: 46.20487, lon: 7.61887 },
  { name: 'Barneuza', km: 22, elevation: 2398, offsetMinutes: 202, time: '14:32', lat: 46.18519, lon: 7.62445 },
  { name: 'Nava', km: 26, elevation: 2199, offsetMinutes: 227, time: '14:57', lat: 46.16423, lon: 7.63462 },
  { name: 'Zinal', km: 31, elevation: 1670, offsetMinutes: 255, time: '15:25', lat: 46.13764, lon: 7.62532, role: 'finish' },
]

export const logisticsPoints = [
  { name: 'Départ', lat: 46.28961, lon: 7.56466, kind: 'race' },
  { name: 'Vercorin', lat: 46.25717, lon: 7.5307, kind: 'route' },
  { name: 'Vissoie', lat: 46.21532, lon: 7.58536, kind: 'route' },
  { name: 'Chandolin', lat: 46.25173, lon: 7.59949, kind: 'spectator' },
  { name: 'Parking Mottec', lat: 46.15671, lon: 7.61987, kind: 'parking' },
  { name: 'Arrivée Zinal', lat: 46.13764, lon: 7.62532, kind: 'finish' },
] as const

export const effortSegments = [
  { km: '0–4', name: 'Mise en route', duration: '30 min', cardio: '< 150', cue: 'Courue, facile' },
  { km: '4–8', name: 'Le mur', duration: '50 min', cardio: '150–158', cue: '700–740 m/h' },
  { km: '8–11', name: 'Transition', duration: '30 min', cardio: '148–152', cue: 'Alterné' },
  { km: '11–22', name: 'Long faux-plat', duration: '1 h 32', cardio: '145–155', cue: 'Cadence 87–90' },
  { km: '22–26', name: 'Descente roulante', duration: '25 min', cardio: '140–150', cue: 'Relâchée' },
  { km: '26–31', name: 'Descente technique', duration: '28 min', cardio: '145–155', cue: 'Petits pas' },
] as const

export const missionSteps = [
  { time: '10:25', title: 'Dans la zone départ', text: 'Accueil obligatoire au plus tard 45 min avant la vague. Environ 600 m balisés jusqu’à la ligne.' },
  { time: '11:10', title: 'Voir le départ', text: 'Vague 2 · dossard 8537. Repars aussitôt vers la voiture.' },
  { time: '11:15–12:35', title: 'Route vers Chandolin', text: 'Option robuste : Vercorin → Vissoie → Chandolin. La route directe d’Anniviers reste fermée jusqu’à 11:30.' },
  { time: '12:40', title: 'Point de décision', text: 'Si tu n’es pas garé à Chandolin : abandonne ce point et file vers Mottec. L’arrivée prime.' },
  { time: '≈ 13:00', title: 'Voir Estelle à Chandolin', text: 'Km 11. Place-toi avant le ravitaillement, côté course, sans traverser le flux.' },
  { time: '13:05', title: 'Départ impératif', text: 'Chandolin → Vissoie → Mottec. Compte 45–60 min avec le trafic événementiel.' },
  { time: '14:10–14:20', title: 'Parking spectateurs Mottec', text: 'Laisse la voiture au parking officiel. Navette gratuite ou 2,4 km à pied/course jusqu’à Zinal.' },
  { time: '14:45', title: 'Installé à l’arrivée', text: 'Marge cible de 40 min avant l’arrivée prévue à 15:25.' },
] as const
