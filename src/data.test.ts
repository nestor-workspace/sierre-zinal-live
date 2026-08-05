import { describe, expect, it } from 'vitest'
import { checkpoints, drive, drivingPoints, links, mapPoints, missionSteps } from './data'

describe('field logistics', () => {
  it('routes the car directly from Zwissig to Mottec', () => {
    expect(drivingPoints.map((point) => point.shortName)).toEqual(['Zwissig', 'Mottec'])
    expect(mapPoints.map((point) => point.shortName)).toEqual(['Sierre', 'Zwissig', 'Mottec', 'Zinal'])
    expect(links.navigate).toContain('destination=46.1567079,7.6198685')
    expect(drive).toEqual({ distance: '23,9 km', baseline: '25–30 min', eventBudget: '45–60 min' })
  })

  it('keeps Chandolin as a runner checkpoint only', () => {
    expect(checkpoints.find((point) => point.name === 'Chandolin')).toMatchObject({ km: 11, time: '13:00' })
    expect(drivingPoints.map((point) => point.shortName)).not.toContain('Chandolin')
    expect(mapPoints.map((point) => point.shortName)).not.toContain('Chandolin')
    expect(missionSteps.some((step) => `${step.title} ${step.text}`.includes('Chandolin'))).toBe(false)
  })

  it('budgets the drive only after the road reopens', () => {
    expect(missionSteps.find((step) => step.title === 'Parking Mottec')?.time).toBe('12:15–12:30')
    expect(missionSteps.at(-1)).toMatchObject({ time: '15:25', title: 'Arrivée Estelle' })
  })
})
