import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { checkpoints, logisticsPoints } from '../data'

type LayerMode = 'course' | 'mission'

const missionCoordinates = logisticsPoints.map((point) => `${point.lon},${point.lat}`).join(';')

function markerIcon(label: string, accent = false) {
  return L.divIcon({
    className: 'map-marker-shell',
    html: `<span class="map-marker ${accent ? 'map-marker--accent' : ''}">${label}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

export function CourseMap() {
  const elementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const courseRef = useRef<L.Polyline | null>(null)
  const missionRef = useRef<L.Polyline | null>(null)
  const [mode, setMode] = useState<LayerMode>('course')
  const [message, setMessage] = useState('Chargement du tracé…')
  const [missionReady, setMissionReady] = useState(false)

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return
    const map = L.map(elementRef.current, { zoomControl: false, preferCanvas: true })
    mapRef.current = map
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map)

    checkpoints.filter((checkpoint) => checkpoint.role).forEach((checkpoint) => {
      const isSpectator = checkpoint.role === 'spectator'
      L.marker([checkpoint.lat, checkpoint.lon], { icon: markerIcon(isSpectator ? '👁' : checkpoint.role === 'start' ? 'S' : 'Z', isSpectator) })
        .bindPopup(`<strong>${checkpoint.name}</strong><br>Km ${checkpoint.km} · passage prévu ${checkpoint.time}`)
        .addTo(map)
    })
    const mottec = logisticsPoints.find((point) => point.name === 'Parking Mottec')!
    L.marker([mottec.lat, mottec.lon], { icon: markerIcon('P', true) })
      .bindPopup('<strong>Parking Mottec</strong><br>Parking spectateurs officiel puis 2,4 km vers Zinal.')
      .addTo(map)

    fetch(`${import.meta.env.BASE_URL}data/sierre-zinal-2026.gpx`).then((response) => {
      if (!response.ok) throw new Error('GPX indisponible')
      return response.text()
    }).then((gpx) => {
      const xml = new DOMParser().parseFromString(gpx, 'application/xml')
      const latLngs = Array.from(xml.getElementsByTagNameNS('*', 'trkpt')).map((point) =>
        L.latLng(Number(point.getAttribute('lat')), Number(point.getAttribute('lon'))),
      )
      const course = L.polyline(latLngs, { color: '#e46f51', weight: 5, opacity: 0.95 }).addTo(map)
      courseRef.current = course
      map.fitBounds(course.getBounds(), { padding: [18, 18] })
      setMessage('31 km · tracé GPX Strava')
    }).catch(() => {
      map.setView([46.22, 7.6], 11)
      setMessage('Tracé indisponible hors connexion')
    })

    fetch(`https://router.project-osrm.org/route/v1/driving/${missionCoordinates}?overview=full&geometries=geojson`)
      .then((response) => response.ok ? response.json() : null)
      .catch(() => null)
      .then((mission) => {
      const routeCoordinates = mission?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined
      if (routeCoordinates) {
        missionRef.current = L.polyline(routeCoordinates.map(([lon, lat]) => [lat, lon] as L.LatLngExpression), {
          color: '#e6b85c', weight: 5, opacity: 0.9, dashArray: '9 8',
        })
        setMissionReady(true)
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (courseRef.current) {
      if (mode === 'course') courseRef.current.addTo(map)
      else courseRef.current.removeFrom(map)
    }
    if (missionRef.current) {
      if (mode === 'mission') missionRef.current.addTo(map)
      else missionRef.current.removeFrom(map)
    }
  }, [mode, message, missionReady])

  function locateMe() {
    mapRef.current?.locate({ setView: true, maxZoom: 15 })
    mapRef.current?.once('locationfound', (event) => {
      L.circleMarker(event.latlng, { radius: 8, color: '#fff', fillColor: '#2c6e62', fillOpacity: 1, weight: 3 })
        .bindPopup('Ta position')
        .addTo(mapRef.current!)
        .openPopup()
    })
  }

  return (
    <div className="map-wrap">
      <div className="map-controls" aria-label="Calques de la carte">
        <button className={mode === 'course' ? 'active' : ''} onClick={() => setMode('course')}>Course</button>
        <button className={mode === 'mission' ? 'active' : ''} onClick={() => setMode('mission')}>Mission Cyril</button>
      </div>
      <button className="locate-button" onClick={locateMe} aria-label="Afficher ma position">⌖</button>
      <div ref={elementRef} className="course-map" role="img" aria-label="Carte OpenStreetMap du parcours Sierre-Zinal" />
      <div className="map-caption"><span>{message}</span><span>GPX · OSM</span></div>
    </div>
  )
}
