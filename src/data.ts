export const RACE_START = new Date('2026-08-08T11:10:00+02:00')
export const PLANNED_FINISH = new Date('2026-08-08T15:25:00+02:00')

const zwissig = { name: 'Parking Zwissig', shortName: 'Zwissig', lat: 46.2944797, lon: 7.5502294, kind: 'parking' } as const
const mottec = { name: 'Parking Mottec', shortName: 'Mottec', lat: 46.1567079, lon: 7.6198685, kind: 'parking' } as const

export const links = {
  estelle: 'https://datasport.com/fr/course/sierre-zinal-2026/participant/chauveau-estelle',
  ranking: 'https://datasport.com/fr/course/sierre-zinal-2026/ranking',
  live: 'https://www.sierre-zinal.com/fr/live-127.html',
  traffic: 'https://www.sierre-zinal.com/fr/restrictions-circulation-2887.html',
  access: 'https://www.sierre-zinal.com/fr/acces-parkings-415.html',
  mottec: 'https://www.sierre-zinal.com/fr/parking-acces-zinal-2884.html',
  navigate: `https://www.google.com/maps/dir/?api=1&origin=${zwissig.lat},${zwissig.lon}&destination=${mottec.lat},${mottec.lon}&travelmode=driving`,
} as const

export const drive = {
  distance: '23,9 km',
  baseline: '25–30 min',
  eventBudget: '45–60 min',
} as const

export type Checkpoint = {
  name: string
  km: number
  elevation: number
  offsetMinutes: number
  time: string
  lat: number
  lon: number
  role?: 'start' | 'finish'
}

export const checkpoints: Checkpoint[] = [
  { name: 'Sierre', km: 0, elevation: 585, offsetMinutes: 0, time: '11:10', lat: 46.28961, lon: 7.56466, role: 'start' },
  { name: 'Km 4', km: 4, elevation: 1600, offsetMinutes: 30, time: '11:40', lat: 46.27479, lon: 7.56381 },
  { name: 'Km 8', km: 8, elevation: 1936, offsetMinutes: 80, time: '12:30', lat: 46.26948, lon: 7.59761 },
  { name: 'Chandolin', km: 11, elevation: 2000, offsetMinutes: 110, time: '13:00', lat: 46.25173, lon: 7.59949 },
  { name: 'Tignousa', km: 16, elevation: 2210, offsetMinutes: 155, time: '13:45', lat: 46.22298, lon: 7.62266 },
  { name: 'Weisshorn', km: 19.5, elevation: 2425, offsetMinutes: 185, time: '14:15', lat: 46.20487, lon: 7.61887 },
  { name: 'Barneuza', km: 22, elevation: 2398, offsetMinutes: 202, time: '14:32', lat: 46.18519, lon: 7.62445 },
  { name: 'Nava', km: 26, elevation: 2199, offsetMinutes: 227, time: '14:57', lat: 46.16423, lon: 7.63462 },
  { name: 'Zinal', km: 31, elevation: 1670, offsetMinutes: 255, time: '15:25', lat: 46.13764, lon: 7.62532, role: 'finish' },
]

export const drivingPoints = [zwissig, mottec] as const

export const mapPoints = [
  { name: 'Départ Sierre', shortName: 'Sierre', lat: 46.28961, lon: 7.56466, kind: 'race' },
  zwissig,
  mottec,
  { name: 'Arrivée Zinal', shortName: 'Zinal', lat: 46.13764, lon: 7.62532, kind: 'finish' },
] as const

export const missionSteps = [
  { time: '10:25', title: 'Départ Sierre', text: 'Dans la zone départ, puis ligne à 11:10.' },
  { time: '11:15', title: 'Voiture', text: 'Rejoins Zwissig et attends la réouverture si nécessaire.' },
  { time: '12:15–12:30', title: 'Parking Mottec', text: '23,9 km · prévoir 45–60 min après la réouverture.' },
  { time: 'dès l’arrivée', title: 'Navette ou pied', text: 'Navette gratuite continue 08:00–22:00, ou environ 2,4 km à pied.' },
  { time: 'avant 14:45', title: 'Se placer à Zinal', text: 'Rejoins la zone d’arrivée et choisis ton point de vue.' },
  { time: '15:25', title: 'Arrivée Estelle', text: 'Passage prévu sur l’objectif 4 h 15.' },
] as const
