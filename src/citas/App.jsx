import React, { useEffect, useState } from 'react'
import PatientView from './Patient.jsx'
import DoctorView from './Doctor.jsx'

const parse = () => (location.hash.replace(/^#\/?/, '') || '').split('/')

export default function App() {
  const [route, setRoute] = useState(parse())
  useEffect(() => {
    const f = () => { setRoute(parse()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f)
  }, [])
  const go = h => { location.hash = '#/' + h }
  const [view, sec] = route

  const ribbon = (
    <div style={{
      background: '#1e1b4b', color: '#ede9fe', fontSize: 12, padding: '8px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      borderBottom: '1px solid rgba(255,255,255,.1)', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/" style={{ color: '#c4b5fd', fontWeight: 600, textDecoration: 'none' }}>← Volver a Demos</a>
        <span>DEMO-03 · <b>Sistema de Gestión de Citas Paciente / Doctor</b></span>
      </div>
      <a href="https://ideasmagna.com/#canal" style={{
        background: '#7c3aed', color: '#fff', padding: '5px 12px', borderRadius: 6,
        fontWeight: 600, fontSize: 11.5, textDecoration: 'none'
      }}>Quiero un sistema así →</a>
    </div>
  )

  if (view === 'paciente') return <>{ribbon}<PatientView goHome={() => go('')} /></>
  if (view === 'doctora') return <>{ribbon}<DoctorView section={sec} nav={s => go('doctora/' + s)} goPatient={() => go('paciente')} goHome={() => go('')} /></>

  return (
    <>
    {ribbon}
    <div className="home">
      <div className="home-in">
        <div className="eyebrow">Demo interactiva · datos ficticios</div>
        <h1>Clínica NovaSalud · Gestión de Citas</h1>
        <p className="lead">Citas por WhatsApp con IA, preevaluación en línea y un panel para gestionar su consulta. Elija una vista para recorrerla.</p>
        <div className="home-cards">
          <button className="hcard" onClick={() => go('paciente')}>
            <div className="hc-ic pink">♀</div>
            <b>Vista de la paciente</b>
            <span>Escriba por WhatsApp, llene la preevaluación con el mapa del cuerpo y agende su primera consulta.</span>
            <em>Entrar →</em>
          </button>
          <button className="hcard" onClick={() => go('doctora/inicio')}>
            <div className="hc-ic purple">✚</div>
            <b>Vista de la doctora</b>
            <span>Su panel completo: agenda, prospectos, pacientes, preevaluaciones, mensajes, seguimiento y estadísticas.</span>
            <em>Entrar →</em>
          </button>
        </div>
        <p className="tipline">Sugerencia: empiece como paciente y luego abra la vista de la doctora. Su caso aparecerá en el panel.</p>
        <p className="fine">Prototipo de Ideas Magna para mostrar cómo se verá y cómo funcionará el sistema. No guarda datos reales: lo que escriba se queda solo en este navegador.</p>
      </div>
    </div>
    </>
  )
}
