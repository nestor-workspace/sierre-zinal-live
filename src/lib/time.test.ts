import { describe, expect, it } from 'vitest'
import { formatDuration, nextOperationalAction, projectedCheckpoint, racePhase } from './time'

describe('race timing', () => {
  it('identifies the three race phases', () => {
    expect(racePhase(new Date('2026-08-08T11:00:00+02:00'))).toBe('before')
    expect(racePhase(new Date('2026-08-08T13:00:00+02:00'))).toBe('running')
    expect(racePhase(new Date('2026-08-08T15:25:00+02:00'))).toBe('finished')
  })

  it('projects Chandolin at 110 minutes', () => {
    expect(projectedCheckpoint(new Date('2026-08-08T13:00:00+02:00')).name).toBe('Chandolin')
  })

  it('formats countdowns without negative time', () => {
    expect(formatDuration(3_661_000)).toBe('01:01:01')
    expect(formatDuration(-1)).toBe('00:00:00')
  })

  it('sequences safe spectator actions around the road reopening', () => {
    expect(nextOperationalAction(new Date('2026-08-08T10:00:00+02:00'))).toContain('zone départ')
    expect(nextOperationalAction(new Date('2026-08-08T10:30:00+02:00'))).toContain('départ d’Estelle')
    expect(nextOperationalAction(new Date('2026-08-08T11:29:00+02:00'))).toContain('11:30 · route')
    expect(nextOperationalAction(new Date('2026-08-08T11:30:00+02:00'))).toContain('Mottec')
    expect(nextOperationalAction(new Date('2026-08-08T12:30:00+02:00'))).toContain('Navette ou pied')
    expect(nextOperationalAction(new Date('2026-08-08T14:45:00+02:00'))).toContain('15:25 · arrivée')
    expect(nextOperationalAction(new Date('2026-08-08T15:25:00+02:00'))).toContain('Datasport')
  })
})
