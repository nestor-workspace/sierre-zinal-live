import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { drive, links, mapPoints } from '../data'

type LayerMode = 'drive' | 'course'

type RouteGeoJson = {
  features?: Array<{ geometry?: { coordinates?: [number, number][] } }>
}

function markerIcon(label: string, accent = false) {
  return L.divIcon({
    className: 'map-marker-shell',
    html: `<span class="map-marker ${accent ? 'map-marker--accent' : ''}">${label}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export function CourseMap() {
  const elementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const courseRef = useRef<L.Polyline | null>(null)
  const driveRef = useRef<L.Polyline | null>(null)
  const transferRef = useRef<L.Polyline | null>(null)
  const [mode, setMode] = useState<LayerMode>('drive')
  const [driveReady, setDriveReady] = useState(false)

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return
    let cancelled = false
    const map = L.map(elementRef.current, { zoomControl: false, preferCanvas: true })
    mapRef.current = map
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map)

    mapPoints.forEach((point) => {
      const label = point.shortName === 'Sierre' ? 'D' : point.shortName === 'Zwissig' ? 'V' : point.shortName === 'Mottec' ? 'P' : 'A'
      const accent = point.shortName === 'Mottec' || point.shortName === 'Zinal'
      L.marker([point.lat, point.lon], { icon: markerIcon(label, accent) })
        .bindPopup(`<strong>${point.name}</strong>`)
        .addTo(map)
    })

    const mottec = mapPoints.find((point) => point.shortName === 'Mottec')!
    const zinal = mapPoints.find((point) => point.shortName === 'Zinal')!
    transferRef.current = L.polyline([[mottec.lat, mottec.lon], [zinal.lat, zinal.lon]], {
      color: '#146a61', weight: 4, opacity: 0.9, dashArray: '5 7',
    }).bindTooltip('Navette / pied · env. 2,4 km')

    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/sierre-mottec-route.geojson`).then((response) => {
        if (!response.ok) throw new Error('Route locale indisponible')
        return response.json() as Promise<RouteGeoJson>
      }),
      fetch(`${import.meta.env.BASE_URL}data/sierre-zinal-2026.gpx`).then((response) => {
        if (!response.ok) throw new Error('GPX indisponible')
        return response.text()
      }),
    ]).then(([route, gpx]) => {
      if (cancelled) return

      const routeCoordinates = route.features?.[0]?.geometry?.coordinates
      if (routeCoordinates?.length) {
        driveRef.current = L.polyline(routeCoordinates.map(([lon, lat]) => [lat, lon] as L.LatLngExpression), {
          color: '#d9553b', weight: 6, opacity: 0.95,
        })
        driveRef.current.addTo(map)
        transferRef.current?.addTo(map)
        map.fitBounds(driveRef.current.getBounds().extend([zinal.lat, zinal.lon]), { padding: [24, 24] })
        setDriveReady(true)
      }

      const xml = new DOMParser().parseFromString(gpx, 'application/xml')
      const courseCoordinates = Array.from(xml.getElementsByTagNameNS('*', 'trkpt')).map((point) =>
        L.latLng(Number(point.getAttribute('lat')), Number(point.getAttribute('lon'))),
      )
      courseRef.current = L.polyline(courseCoordinates, { color: '#146a61', weight: 5, opacity: 0.92 })
    }).catch(() => {
      if (cancelled) return
      map.fitBounds([[46.13764, 7.62532], [46.29448, 7.55023]], { padding: [24, 24] })
    })

    return () => {
      cancelled = true
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const zinal = mapPoints.find((point) => point.shortName === 'Zinal')!
    const driveLayers = [driveRef.current, transferRef.current]
    driveLayers.forEach((layer) => {
      if (!layer) return
      if (mode === 'drive') layer.addTo(map)
      else layer.removeFrom(map)
    })
    if (courseRef.current) {
      if (mode === 'course') {
        courseRef.current.addTo(map)
        map.fitBounds(courseRef.current.getBounds(), { padding: [24, 24] })
      } else {
        courseRef.current.removeFrom(map)
        if (driveRef.current) map.fitBounds(driveRef.current.getBounds().extend([zinal.lat, zinal.lon]), { padding: [24, 24] })
      }
    }
  }, [mode, driveReady])

  function locateMe() {
    mapRef.current?.locate({ setView: true, maxZoom: 15 })
    mapRef.current?.once('locationfound', (event) => {
      L.circleMarker(event.latlng, { radius: 8, color: '#fff', fillColor: '#146a61', fillOpacity: 1, weight: 3 })
        .bindPopup('Ma position')
        .addTo(mapRef.current!)
        .openPopup()
    })
  }

  return (
    <div className="map-wrap">
      <div className="map-controls" role="group" aria-label="Calques de la carte">
        <button className={mode === 'drive' ? 'active' : ''} aria-pressed={mode === 'drive'} onClick={() => setMode('drive')}>Voiture</button>
        <button className={mode === 'course' ? 'active' : ''} aria-pressed={mode === 'course'} onClick={() => setMode('course')}>Course</button>
      </div>
      <button className="locate-button" onClick={locateMe} aria-label="Afficher ma position">⌖</button>
      <div ref={elementRef} className="course-map" role="img" aria-label="Carte du trajet entre Sierre, Mottec et Zinal" />
      {mode === 'drive' ? (
        <>
          <div className="map-metrics">
            <strong>{drive.distance}</strong>
            <span>{drive.baseline} hors trafic</span>
            <b>{drive.eventBudget} événement</b>
          </div>
          <a className="map-navigation" href={links.navigate} target="_blank" rel="noreferrer">Naviguer <span>↗</span></a>
        </>
      ) : (
        <div className="map-metrics map-metrics--course">
          <strong>31 km</strong>
          <span>2 200 m D+</span>
          <b>11:10 → 15:25</b>
        </div>
      )}
    </div>
  )
}
