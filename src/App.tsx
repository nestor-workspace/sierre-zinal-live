import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Car, CheckCircle2, CloudSun, Download, ExternalLink, Eye, Map, Mountain, Navigation, Radio, Route, ShieldAlert, Trophy } from 'lucide-react'
import { CourseMap } from './components/CourseMap'
import { Weather } from './components/Weather'
import { checkpoints, effortSegments, links, missionSteps, PLANNED_FINISH, RACE_START } from './data'
import { projectedCheckpoint, raceStatus } from './lib/time'
import './App.css'

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Zurich', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(date)
}

function App() {
  const [now, setNow] = useState(() => new Date())
  const [checked, setChecked] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('sz-checklist') ?? '[]') }
    catch { return [] }
  })
  const status = useMemo(() => raceStatus(now), [now])
  const next = useMemo(() => projectedCheckpoint(now), [now])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  function toggleCheck(item: string) {
    const updated = checked.includes(item) ? checked.filter((entry) => entry !== item) : [...checked, item]
    setChecked(updated)
    localStorage.setItem('sz-checklist', JSON.stringify(updated))
  }

  return (
    <>
      <header className="hero-header">
        <nav className="topbar"><span className="brand">SIERRE—ZINAL <i>2026</i></span><span className="bib">DOSSARD <b>8537</b></span></nav>
        <div className="hero-content">
          <div className="eyebrow"><Radio size={15} /> Tableau de bord course</div>
          <h1>Estelle<br /><em>sur la couronne</em></h1>
          <p>{formatDateTime(RACE_START)} · Vague 2</p>
          <div className="hero-stats">
            <div><strong>31</strong><span>kilomètres</span></div>
            <div><strong>2 200</strong><span>mètres D+</span></div>
            <div><strong>4:15</strong><span>objectif</span></div>
            <div><strong>15:25</strong><span>arrivée prévue</span></div>
          </div>
        </div>
        <div className="mountain-lines" aria-hidden="true"><span /><span /><span /></div>
      </header>

      <main>
        <section className="live-panel section-wide">
          <div className="live-copy">
            <span className={`pulse pulse--${status.phase}`} />
            <div><small>{status.label}</small><strong>{status.value}</strong></div>
          </div>
          <div className="live-progress">
            <div><span style={{ width: `${status.progress ?? (status.phase === 'finished' ? 100 : 0)}%` }} /></div>
            <p>{status.phase === 'running' ? `Prochain repère théorique : ${next.name}, ${next.time}` : status.phase === 'before' ? 'Samedi 8 août · départ 11:10' : 'Consulte Datasport pour le résultat réel.'}</p>
          </div>
          <div className="live-actions">
            <a className="button button--primary" href={links.estelle} target="_blank"><Radio size={17} /> Suivre Estelle en direct <ArrowUpRight size={16} /></a>
            <a className="button button--ghost" href={links.ranking} target="_blank"><Trophy size={17} /> Classements</a>
          </div>
        </section>

        <section className="section-grid intro-grid">
          <div>
            <div className="section-kicker">Plan spectateur</div>
            <h2>Deux visions.<br />Zéro improvisation.</h2>
          </div>
          <p className="lead">Le scénario réaliste est <strong>départ à Sierre → Chandolin au km 11 → arrivée à Zinal</strong>. Tignousa est séduisant sur le papier ; avec le funiculaire toutes les 30 minutes, il transforme l’arrivée en pari. Nous ne parions pas avec une ligne d’arrivée.</p>
        </section>

        <section className="mission-card section-wide">
          <div className="mission-head"><div><Navigation /><span>Mission Cyril</span></div><strong>11:10 → 15:25</strong></div>
          <div className="mission-timeline">
            {missionSteps.map((step, index) => (
              <article key={step.time} className={step.time === '12:40' ? 'decision' : ''}>
                <div className="timeline-marker"><span>{index + 1}</span></div>
                <time>{step.time}</time>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </article>
            ))}
          </div>
          <div className="abort-rule"><ShieldAlert /><div><strong>Règle d’abandon</strong><p>Pas garé à Chandolin à 12:40 ? Direction Mottec immédiatement. Cela conserve une marge saine pour l’arrivée.</p></div></div>
        </section>

        <section className="section-wide map-section">
          <div className="section-heading"><div><div className="section-kicker">Terrain</div><h2>Course & itinéraire</h2></div><p>Bascule entre le GPX d’Estelle et l’itinéraire routier recommandé. La géolocalisation fonctionne sur place.</p></div>
          <CourseMap />
        </section>

        <section className="section-wide road-section">
          <div className="section-heading"><div><div className="section-kicker">Circulation</div><h2>Les routes imposent le tempo</h2></div><a className="text-link" href={links.traffic} target="_blank">Source officielle <ExternalLink size={14} /></a></div>
          <div className="parking-strip parking-strip--start"><Car /><div><strong>Départ : Gravière ou Zwissig</strong><span>Ce sont les parkings officiellement fléchés « départ ». Gare-toi avant 10:15 et suis le dispositif local ; la route d’Anniviers sera de toute façon verrouillée jusqu’à 11:30.</span></div><a href={links.access} target="_blank">Plan officiel <ArrowUpRight size={15} /></a></div>
          <div className="road-grid">
            <article><time>10:55–11:30</time><h3>Route d’Anniviers coupée à Sierre</h3><p>Fermeture dans les deux sens. L’accès par Vercorin reste ouvert en continu.</p></article>
            <article><time>10:25–12:30</time><h3>Vissoie → Sierre fermé</h3><p>La montée reste exploitable. Descente détournée par Vercorin.</p></article>
            <article><time>06:00–14:00</time><h3>Ayer → Chandolin fermé</h3><p>Chandolin doit être rejoint depuis Vissoie. C’est précisément notre axe.</p></article>
            <article><time>11:45–13:30</time><h3>Zinal → Vissoie fermé</h3><p>Concerne la descente. Notre trajet vers Mottec est montant, mais attends-toi aux ralentissements.</p></article>
          </div>
          <div className="parking-strip"><Car /><div><strong>Parking final : Mottec</strong><span>Filtrage à l’entrée de Zinal · navette gratuite 08:00–22:00 · environ 2,4 km à pied/course.</span></div><a href={links.mottec} target="_blank">Détails <ArrowUpRight size={15} /></a></div>
        </section>

        <section className="section-wide course-plan">
          <div className="section-heading"><div><div className="section-kicker">Barème 4 h 15</div><h2>Le fil de sa course</h2></div><a className="button button--light" href={`${import.meta.env.BASE_URL}data/plan-effort-estelle.pdf`} target="_blank"><Download size={16} /> Plan PDF</a></div>
          <div className="checkpoint-track">
            {checkpoints.map((point) => (
              <article key={point.name} className={point.role ? `checkpoint checkpoint--${point.role}` : 'checkpoint'}>
                <div className="checkpoint-dot" />
                <time>{point.time}</time><h3>{point.name}</h3><span>km {point.km} · {point.elevation} m</span>
              </article>
            ))}
          </div>
          <div className="effort-table">
            {effortSegments.map((segment) => <article key={segment.km}><span>KM {segment.km}</span><div><strong>{segment.name}</strong><small>{segment.duration}</small></div><div><b>{segment.cardio}</b><small>cardio</small></div><em>{segment.cue}</em></article>)}
          </div>
        </section>

        <section className="section-wide weather-section">
          <div className="section-heading"><div><div className="section-kicker">Météo dynamique</div><h2>Trois altitudes, trois ambiances</h2></div><CloudSun /></div>
          <Weather />
          <p className="weather-note">Températures réelles prévues, pas de « ressenti ». Données Open-Meteo actualisées au chargement ; contrôle MeteoSwiss recommandé samedi matin.</p>
        </section>

        <section className="section-grid practical-grid">
          <div>
            <div className="section-kicker">Avant de partir</div><h2>Checklist de poche</h2>
            <div className="checklist">
              {['Téléphone chargé + batterie externe', 'GPX et dashboard ouverts une fois hors ligne', 'Chaussures permettant les 2,4 km rapides', 'Eau, veste et protection solaire', 'Photo du dossard 8537', 'Point de rendez-vous après la ligne'].map((item) => (
                <button key={item} onClick={() => toggleCheck(item)} className={checked.includes(item) ? 'checked' : ''}><CheckCircle2 />{item}</button>
              ))}
            </div>
          </div>
          <aside className="quick-links">
            <h3>Accès directs</h3>
            <a href={links.estelle} target="_blank"><Radio />Fiche live Estelle<span>Datasport <ArrowUpRight /></span></a>
            <a href={links.live} target="_blank"><Eye />Live officiel<span>Sierre-Zinal <ArrowUpRight /></span></a>
            <a href={links.access} target="_blank"><Car />Parkings & accès<span>Organisation <ArrowUpRight /></span></a>
            <a href={links.spectator} target="_blank"><Map />Voir la course<span>Points spectateurs <ArrowUpRight /></span></a>
            <a href={`${import.meta.env.BASE_URL}data/sierre-zinal-2026.gpx`} download><Route />Télécharger le GPX<span>Fichier <Download /></span></a>
          </aside>
        </section>

        <section className="section-wide caveat">
          <AlertTriangle /><div><strong>Horaires théoriques</strong><p>Les passages reposent sur le plan 4 h 15. En course, Datasport est la vérité opérationnelle. Pars toujours sur la borne basse et place-toi dix minutes avant.</p></div>
        </section>
      </main>

      <footer><div><Mountain /><strong>SIERRE—ZINAL</strong></div><p>Construit pour Estelle et Cyril · données course 2026</p><span>Objectif {PLANNED_FINISH.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span></footer>
    </>
  )
}

export default App
