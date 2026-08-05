import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Car, ExternalLink, FileDown, Flag, Footprints, MapPinned, Radio, Route } from 'lucide-react'
import { CourseMap } from './components/CourseMap'
import { checkpoints, links, missionSteps } from './data'
import { nextOperationalAction, raceStatus } from './lib/time'
import './App.css'

function App() {
  const [now, setNow] = useState(() => new Date())
  const status = useMemo(() => raceStatus(now), [now])
  const nextAction = useMemo(() => nextOperationalAction(now), [now])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <main className="field-tool">
      <header className="status-card">
        <div className="identity">
          <div><strong>Estelle</strong><span>vague 2</span></div>
          <b>8537</b>
        </div>

        <div className="race-state">
          <span className={`pulse pulse--${status.phase}`} aria-hidden="true" />
          <div><small>{status.label}</small><strong>{status.value}</strong></div>
        </div>

        <a className="primary-action" href={links.estelle} target="_blank" rel="noreferrer">
          <Radio size={19} /> Datasport <ArrowUpRight size={18} />
        </a>

        <div className="next-action"><span>PROCHAINE ACTION</span><strong>{nextAction}</strong></div>
      </header>

      <section className="closure-alert" aria-label="Alerte circulation">
        <AlertTriangle size={22} />
        <div><strong>Route d’Anniviers fermée</strong><span>10:55–11:30 · ne pas tenter de partir avant la réouverture</span></div>
      </section>

      <section className="tool-block logistics">
        <div className="block-label"><Flag size={17} /><span>PLANNING</span></div>
        <ol>
          {missionSteps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number">{index + 1}</span>
              <time>{step.time}</time>
              <div><strong>{step.title}</strong><span>{step.text}</span></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="tool-block">
        <div className="block-label"><MapPinned size={17} /><span>CARTE</span></div>
        <CourseMap />
      </section>

      <section className="tool-block checkpoints-block">
        <div className="block-label"><Route size={17} /><span>PASSAGES THÉORIQUES · OBJECTIF 4 H 15</span></div>
        <div className="checkpoint-strip">
          {checkpoints.map((point) => (
            <article key={point.name}>
              <time>{point.time}</time>
              <strong>{point.name}</strong>
              <span>km {point.km}</span>
            </article>
          ))}
        </div>
        <p className="data-note">Datasport reste la référence réelle le jour de la course.</p>
      </section>

      <nav className="tool-block direct-links" aria-label="Liens directs">
        <div className="block-label"><ExternalLink size={17} /><span>LIENS</span></div>
        <div>
          <a href={links.navigate} target="_blank" rel="noreferrer"><Car />Naviguer vers Mottec<ArrowUpRight /></a>
          <a href={links.live} target="_blank" rel="noreferrer"><Radio />Live officiel<ArrowUpRight /></a>
          <a href={links.traffic} target="_blank" rel="noreferrer"><AlertTriangle />Circulation<ArrowUpRight /></a>
          <a href={links.access} target="_blank" rel="noreferrer"><MapPinned />Parkings officiels<ArrowUpRight /></a>
          <a href={`${import.meta.env.BASE_URL}data/sierre-zinal-2026.gpx`} download><FileDown />GPX course<ArrowUpRight /></a>
          <a href={`${import.meta.env.BASE_URL}data/plan-effort-estelle.pdf`} target="_blank" rel="noreferrer"><Footprints />Plan effort PDF<ArrowUpRight /></a>
        </div>
      </nav>
    </main>
  )
}

export default App
