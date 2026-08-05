import { checkpoints, PLANNED_FINISH, RACE_START } from '../data'

export type RacePhase = 'before' | 'running' | 'finished'

export function racePhase(now: Date): RacePhase {
  if (now < RACE_START) return 'before'
  if (now >= PLANNED_FINISH) return 'finished'
  return 'running'
}

export function formatDuration(milliseconds: number): string {
  const total = Math.max(0, Math.floor(milliseconds / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (days > 0) return `${days} j ${String(hours).padStart(2, '0')} h ${String(minutes).padStart(2, '0')}`
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function raceStatus(now: Date) {
  const phase = racePhase(now)
  if (phase === 'before') return { phase, label: 'Départ dans', value: formatDuration(RACE_START.getTime() - now.getTime()) }
  if (phase === 'finished') return { phase, label: 'Fenêtre prévue terminée', value: '15:25' }
  const elapsed = now.getTime() - RACE_START.getTime()
  const target = PLANNED_FINISH.getTime() - RACE_START.getTime()
  const progress = Math.min(100, (elapsed / target) * 100)
  return { phase, label: 'Course en cours', value: formatDuration(elapsed), progress }
}

export function projectedCheckpoint(now: Date) {
  const elapsedMinutes = (now.getTime() - RACE_START.getTime()) / 60000
  return checkpoints.find((checkpoint) => checkpoint.offsetMinutes >= elapsedMinutes) ?? checkpoints.at(-1)!
}

const operationalSteps = [
  { at: new Date('2026-08-08T10:25:00+02:00'), label: '10:25 · être dans la zone départ' },
  { at: RACE_START, label: '11:10 · voir le départ d’Estelle' },
  { at: new Date('2026-08-08T11:30:00+02:00'), label: '11:30 · route d’Anniviers réouverte' },
  { at: new Date('2026-08-08T12:30:00+02:00'), label: 'Mottec · suivre le fléchage parking' },
  { at: new Date('2026-08-08T14:45:00+02:00'), label: 'Navette ou pied → Zinal · placé avant 14:45' },
  { at: PLANNED_FINISH, label: '15:25 · arrivée d’Estelle prévue' },
] as const

export function nextOperationalAction(now: Date): string {
  return operationalSteps.find((step) => now < step.at)?.label ?? 'Vérifier le résultat réel sur Datasport'
}
