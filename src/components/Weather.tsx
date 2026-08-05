import { useEffect, useState } from 'react'
import { CloudRain, CloudSun, Sun } from 'lucide-react'

type WeatherSlot = { place: string; time: string; temperature: number; precipitation: number; wind: number; code: number }

const spots = [
  { place: 'Sierre', time: '11:00', hour: '2026-08-08T11:00', lat: 46.29, lon: 7.56 },
  { place: 'Chandolin', time: '13:00', hour: '2026-08-08T13:00', lat: 46.25, lon: 7.6 },
  { place: 'Zinal', time: '15:00', hour: '2026-08-08T15:00', lat: 46.14, lon: 7.63 },
]

function WeatherIcon({ code }: { code: number }) {
  if (code >= 51) return <CloudRain aria-hidden="true" />
  if (code >= 1) return <CloudSun aria-hidden="true" />
  return <Sun aria-hidden="true" />
}

export function Weather() {
  const [slots, setSlots] = useState<WeatherSlot[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all(spots.map(async (spot) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=Europe%2FZurich&start_date=2026-08-08&end_date=2026-08-08`
      const response = await fetch(url)
      if (!response.ok) throw new Error('forecast unavailable')
      const data = await response.json()
      const index = data.hourly.time.indexOf(spot.hour)
      return {
        place: spot.place,
        time: spot.time,
        temperature: Math.round(data.hourly.temperature_2m[index]),
        precipitation: data.hourly.precipitation_probability[index],
        wind: Math.round(data.hourly.wind_speed_10m[index]),
        code: data.hourly.weather_code[index],
      }
    })).then(setSlots).catch(() => setError(true))
  }, [])

  if (error) return <p className="subtle">Prévision momentanément indisponible. Vérifie MeteoSwiss samedi matin.</p>
  if (!slots.length) return <p className="subtle">Chargement de la prévision du 8 août…</p>

  return (
    <div className="weather-grid">
      {slots.map((slot) => (
        <article className="weather-card" key={slot.place}>
          <div><strong>{slot.place}</strong><span>{slot.time}</span></div>
          <WeatherIcon code={slot.code} />
          <b>{slot.temperature}°C</b>
          <small>Pluie {slot.precipitation}% · vent {slot.wind} km/h</small>
        </article>
      ))}
    </div>
  )
}
