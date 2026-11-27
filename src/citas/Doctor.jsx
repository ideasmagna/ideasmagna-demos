import React, { useMemo, useState, useEffect } from 'react'
import { BreastMap } from './BodyMap.jsx'
const isBackZone = z => ['lumbar', 'sacro', 'gluteo-der', 'gluteo-izq', 'muslo-post'].includes(z)
const Body3D = React.lazy(() => import('./Body3D.jsx'))
import {
  TODAY, TODAY_LABEL, DAYS, TYPES, APPOINTMENTS, BLOCKS, STAGES, PROSPECTS, PREEVALS, PATIENTS, HISTORY,
  THREADS, PLANS, CONTROLS, REMINDERS, STATS, KB, HOURS, ZONES_LABEL, BREAST_LABEL, FREE_SLOTS,
} from './data.js'
import { loadSubs, updateSub, resetDemo } from './store.js'

const SECTIONS = [
  ['inicio', 'Inicio', '⌂'], ['agenda', 'Agenda', '▦'], ['prospectos', 'Prospectos', '◎'], ['pacientes', 'Pacientes', '♀'],
  ['preevaluaciones', 'Preevaluaciones', '✚'], ['mensajes', 'Mensajes', '✉'], ['seguimiento', 'Seguimiento', '↻'],
  ['estadisticas', 'Estadísticas', '▤'], ['conocimiento', 'Base de conocimiento', '❖'], ['horarios', 'Horarios', '◷'], ['ajustes', 'Ajustes y privacidad', '⚙'],
]
const ST = {
  'confirmada': ['Confirmada', 'g'], 'por-confirmar': ['Por confirmar', 'y'], 'reagendada': ['Reagendada', 'p'],
  'atendida': ['Atendida', 'n'], 'no-asistio': ['No asistió', 'r'], 'cancelada': ['Cancelada', 'r'],
}
const Badge = ({ s }) => <span className={'badge ' + (ST[s]?.[1] || 'n')}>{ST[s]?.[0] || s}</span>
const Prio = ({ p }) => <span className={'badge ' + (p === 'alta' ? 'r' : 'n')}>{p === 'alta' ? 'Prioridad alta' : 'Prioridad normal'}</span>
const AI = ({ children = 'Resumen con IA' }) => <span className="ai-tag">✦ {children}</span>

function Drawer({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="drawer-bg" onClick={onClose}>
      <div className={'drawer' + (wide ? ' wide' : '')} onClick={e => e.stopPropagation()}>
        <div className="drawer-h"><h3>{title}</h3><button className="x" onClick={onClose}>✕</button></div>
        <div className="drawer-b">{children}</div>
      </div>
    </div>
  )
}

function useToast() {
  const [t, setT] = useState(null)
  useEffect(() => { if (!t) return; const id = setTimeout(() => setT(null), 2800); return () => clearTimeout(id) }, [t])
  return [t, setT]
}

/* ------------ datos combinados con la demo de paciente ------------ */
function useData() {
  const [subs, setSubs] = useState(loadSubs())
  useEffect(() => {
    const f = () => setSubs(loadSubs())
    window.addEventListener('focus', f); window.addEventListener('storage', f)
    return () => { window.removeEventListener('focus', f); window.removeEventListener('storage', f) }
  }, [])
  return useMemo(() => {
    const slot = label => FREE_SLOTS.find(s => s.label === label)
    const preevals = [...subs, ...PREEVALS]
    const prospects = [
      ...subs.map(s => ({ id: s.folio, name: s.name, phone: '—', source: 'Web', stage: s.booked ? 'agendada' : 'preeval', motive: s.motive[0], when: s.date, last: s.booked ? 'Agendó ' + s.booked : 'Terminó su preevaluación', pre: s.folio, priority: s.priority, demo: true })),
      ...PROSPECTS,
    ]
    const appts = [...APPOINTMENTS]
    subs.filter(s => s.booked && slot(s.booked)).forEach(s => {
      const sl = slot(s.booked)
      appts.push({ id: 'demo-' + s.folio, date: sl.date, time: sl.label.split('· ').pop(), patient: s.name, type: 'Primera vez', status: 'confirmada', pre: s.folio, demo: true })
    })
    return { subs, setSubs, preevals, prospects, appts }
  }, [subs])
}

/* ------------ secciones ------------ */

function Inicio({ d, nav, openPre }) {
  const today = d.appts.filter(a => a.date === TODAY).sort((a, b) => a.time.localeCompare(b.time))
  const pending = d.preevals.filter(p => !p.reviewed)
  const newPros = d.prospects.filter(p => p.stage === 'nuevo' || p.demo)
  return (
    <>
      <div className="page-h"><div><h1>Buenos días, Dra. Sofía</h1><p>{TODAY_LABEL} · {today.length} citas hoy</p></div><button className="btn" onClick={() => nav('agenda')}>+ Nueva cita</button></div>
      <div className="kpis">
        <div className="kpi"><small>Citas hoy</small><b>{today.length}</b><span>{today.filter(a => a.status === 'confirmada').length} confirmadas</span></div>
        <div className="kpi"><small>Prospectos nuevos</small><b className="pink">{newPros.length}</b><span>esta semana: 14</span></div>
        <div className="kpi"><small>Preevaluaciones por leer</small><b className="purple">{pending.length}</b><span>{pending.filter(p => p.priority === 'alta').length} prioritarias</span></div>
        <div className="kpi"><small>De prospecto a cita</small><b className="green">63%</b><span>noviembre</span></div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-h"><h3>Agenda de hoy</h3><button className="link" onClick={() => nav('agenda')}>Ver agenda →</button></div>
          {today.map(a => (
            <div className="row-appt" key={a.id}>
              <b className="time">{a.time}</b>
              <div className="grow"><div>{a.patient}{a.demo && <span className="badge p sm">Tu demo</span>}</div><small>{a.type}{a.pre && <> · <button className="link sm" onClick={() => openPre(a.pre)}>Preevaluación {a.pre}</button></>}</small></div>
              <Badge s={a.status} />
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-h"><h3>Requiere su atención</h3></div>
          {pending.filter(p => p.priority === 'alta').map(p => (
            <button className="att r" key={p.folio} onClick={() => openPre(p.folio)}><b>Preevaluación prioritaria</b><span>{p.folio} · {p.name} · {p.motive[0]}{p.intensity ? ` · ${p.intensity}/10` : ''}</span></button>
          ))}
          {pending.filter(p => p.priority !== 'alta').slice(0, 2).map(p => (
            <button className="att" key={p.folio} onClick={() => openPre(p.folio)}><b>Preevaluación nueva</b><span>{p.folio} · {p.name} · {p.motive[0]}</span></button>
          ))}
          <button className="att" onClick={() => nav('mensajes')}><b>2 preguntas para usted</b><span>Laura García · Jimena Torres</span></button>
          <button className="att" onClick={() => nav('seguimiento')}><b>3 controles vencidos</b><span>Mastografía, Papanicolaou, cita no asistida</span></button>
        </div>
      </div>
      <div className="card">
        <div className="card-h"><h3>Prospectos recientes</h3><button className="link" onClick={() => nav('prospectos')}>Ver embudo →</button></div>
        <div className="mini-funnel">{STAGES.map(s => <div key={s.key}><b>{d.prospects.filter(p => p.stage === s.key).length}</b><span>{s.label}</span></div>)}</div>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> su día de un vistazo. Lo que necesita su atención aparece arriba a la derecha; todo lo demás lo resuelve la asistente.</div>
    </>
  )
}

function Agenda({ d, openPre, toast }) {
  const [sel, setSel] = useState(null)
  const [mode, setMode] = useState('semana')
  const startMin = 8 * 60, endMin = 20 * 60 + 30, PX = 1.1
  const hours = Array.from({ length: 13 }, (_, i) => 8 + i)
  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const days = mode === 'semana' ? DAYS : DAYS.filter(x => x.key === TODAY)
  return (
    <>
      <div className="page-h"><div><h1>Agenda</h1><p>Semana del 10 al 15 de noviembre · sincronizada con su Google Calendar</p></div>
        <div className="seg"><button className={mode === 'dia' ? 'on' : ''} onClick={() => setMode('dia')}>Día</button><button className={mode === 'semana' ? 'on' : ''} onClick={() => setMode('semana')}>Semana</button></div></div>
      <div className="legend">{Object.entries(TYPES).map(([k, v]) => <span key={k}><i style={{ background: v.color }} />{k}</span>)}<span><i className="blk" />Bloqueado</span></div>
      <div className="cal card">
        <div className="cal-grid" style={{ gridTemplateColumns: `52px repeat(${days.length}, 1fr)` }}>
          <div />
          {days.map(x => <div key={x.key} className={'cal-dh' + (x.key === TODAY ? ' today' : '')}>{x.label}</div>)}
          <div className="cal-times" style={{ height: (endMin - startMin) * PX }}>{hours.map(h => <div key={h} style={{ top: (h * 60 - startMin) * PX }}>{h}:00</div>)}</div>
          {days.map(x => (
            <div key={x.key} className="cal-col" style={{ height: (endMin - startMin) * PX }}>
              {hours.map(h => <div key={h} className="cal-line" style={{ top: (h * 60 - startMin) * PX }} />)}
              {BLOCKS.filter(b => b.date === x.key).map(b => <div key={b.label} className="cal-block" style={{ top: (toMin(b.from) - startMin) * PX, height: (toMin(b.to) - toMin(b.from)) * PX }}>{b.label}</div>)}
              {d.appts.filter(a => a.date === x.key).map(a => {
                const t = TYPES[a.type] || { min: 30, color: '#6B46C1' }
                return <button key={a.id} className={'cal-ev ' + a.status} style={{ top: (toMin(a.time) - startMin) * PX, height: t.min * PX - 3, borderLeftColor: t.color }} onClick={() => setSel(a)}>
                  <b>{a.time} {a.patient}</b><span>{a.type}{a.pre ? ' · ✚' : ''}</span></button>
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> su calendario real. Las citas que agenda la asistente aparecen solas. Toque una cita para confirmarla, moverla o cancelarla: la paciente recibe el aviso por WhatsApp.</div>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel?.patient}>
        {sel && <>
          <div className="kv"><span>Fecha</span><b>{DAYS.find(x => x.key === sel.date)?.label} · {sel.time}</b></div>
          <div className="kv"><span>Tipo</span><b>{sel.type}</b></div>
          <div className="kv"><span>Estado</span><Badge s={sel.status} /></div>
          <div className="kv"><span>Agendada por</span><b>Asistente de WhatsApp</b></div>
          {sel.pre && <button className="btn ghost block" onClick={() => { setSel(null); openPre(sel.pre) }}>Ver preevaluación {sel.pre}</button>}
          <div className="btns">
            <button className="btn" onClick={() => { toast('Cita confirmada. La paciente recibió un mensaje por WhatsApp.'); setSel(null) }}>Confirmar</button>
            <button className="btn ghost" onClick={() => { toast('Se envió a la paciente una propuesta de nuevos horarios.'); setSel(null) }}>Reagendar</button>
            <button className="btn ghost red" onClick={() => { toast('Cita cancelada. El horario se ofreció a la lista de espera.'); setSel(null) }}>Cancelar</button>
          </div>
        </>}
      </Drawer>
    </>
  )
}

function Prospectos({ d, openPre, toast }) {
  const [sel, setSel] = useState(null)
  const [src, setSrc] = useState('Todas')
  const list = d.prospects.filter(p => src === 'Todas' || p.source === src)
  return (
    <>
      <div className="page-h"><div><h1>Prospectos</h1><p>Cada persona que le escribe avanza sola por estas etapas</p></div>
        <div className="seg">{['Todas', 'WhatsApp', 'Instagram', 'Web'].map(s => <button key={s} className={src === s ? 'on' : ''} onClick={() => setSrc(s)}>{s}</button>)}</div></div>
      <div className="kanban">
        {STAGES.map(s => {
          const items = list.filter(p => p.stage === s.key)
          return <div className="kcol" key={s.key}>
            <div className="kcol-h"><b>{s.label}</b><span>{items.length}</span></div>
            <small className="kcol-hint">{s.hint}</small>
            {items.map(p => <button key={p.id} className={'kcard' + (p.demo ? ' demo' : '')} onClick={() => setSel(p)}>
              <div className="kc-top"><b>{p.name}</b>{p.priority === 'alta' && <span className="dot r" title="Prioridad alta" />}</div>
              <small>{p.motive}</small>
              <div className="kc-bot"><span className={'src ' + p.source.toLowerCase()}>{p.source}</span><span>{p.when}</span></div>
              {p.demo && <span className="badge p sm">Tu demo</span>}
            </button>)}
          </div>
        })}
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> su embudo de pacientes nuevas. El sistema mueve cada tarjeta sola (cuando llena su preevaluación, agenda o confirma) y hace el seguimiento a las 24 horas y a los 3 días. Usted solo interviene si quiere.</div>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel?.name}>
        {sel && <>
          <div className="kv"><span>Etapa</span><b>{STAGES.find(s => s.key === sel.stage)?.label}</b></div>
          <div className="kv"><span>Motivo</span><b>{sel.motive}</b></div>
          <div className="kv"><span>Llegó por</span><b>{sel.source}</b></div>
          <div className="kv"><span>Teléfono</span><b>{sel.phone}</b></div>
          <div className="kv"><span>Última actividad</span><b>{sel.last}</b></div>
          {sel.followup && <div className="auto">↻ Automático: {sel.followup}</div>}
          {sel.pre && <button className="btn ghost block" onClick={() => { setSel(null); openPre(sel.pre) }}>Ver preevaluación {sel.pre}</button>}
          <label className="lbl">Mensaje personal por WhatsApp</label>
          <textarea className="inp" rows="3" defaultValue={`Hola ${sel.name.split(' ')[0]}, soy la Dra. Sofía. Vi tu mensaje y con gusto te atiendo. ¿Te acomoda alguno de mis horarios de esta semana?`} />
          <button className="btn block" onClick={() => { toast('Mensaje enviado por WhatsApp.'); setSel(null) }}>Enviar mensaje</button>
        </>}
      </Drawer>
    </>
  )
}

function Pacientes({ openPre, toast }) {
  const [q, setQ] = useState('')
  const [m, setM] = useState('Todos')
  const [sel, setSel] = useState(null)
  const motives = ['Todos', ...new Set(PATIENTS.map(p => p.motive))]
  const list = PATIENTS.filter(p => (m === 'Todos' || p.motive === m) && p.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <div className="page-h"><div><h1>Pacientes</h1><p>{PATIENTS.length} pacientes activas</p></div>
        <input className="inp search" placeholder="Buscar paciente…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="chips mb">{motives.map(x => <button key={x} className={'chip' + (m === x ? ' on' : '')} onClick={() => setM(x)}>{x}</button>)}</div>
      <div className="card table-wrap">
        <table className="tbl">
          <thead><tr><th>Paciente</th><th>Motivo</th><th className="hide-sm">Última consulta</th><th>Próxima cita</th><th className="hide-sm">Consultas</th></tr></thead>
          <tbody>{list.map(p => <tr key={p.id} onClick={() => setSel(p)}>
            <td><b>{p.name}</b><small>{p.age} años · {p.tag}</small></td><td>{p.motive}</td><td className="hide-sm">{p.last}</td><td>{p.next}</td><td className="hide-sm">{p.visits}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> su lista de pacientes. Cada prospecta que asiste a consulta pasa aquí sola, con su historial de citas, preevaluaciones y planes enviados.</div>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel?.name}>
        {sel && <>
          <div className="pill-row"><span className="badge p">{sel.tag}</span><span className="badge n">{sel.age} años</span></div>
          <div className="kv"><span>WhatsApp</span><b>{sel.phone}</b></div>
          <div className="kv"><span>Próxima cita</span><b>{sel.next}</b></div>
          <div className="kv"><span>Consultas</span><b>{sel.visits}</b></div>
          {sel.pre && <button className="btn ghost block" onClick={() => { setSel(null); openPre(sel.pre) }}>Ver preevaluación {sel.pre}</button>}
          <h4>Historial</h4>
          {sel.visits === 0 ? <p className="muted">Primera consulta pendiente.</p> : HISTORY.default.map(h => <div className="hist" key={h.date}><b>{h.date} · {h.type}</b><span>{h.note}</span></div>)}
          <h4>Notas privadas</h4>
          <textarea className="inp" rows="3" placeholder="Solo usted ve estas notas" />
          <div className="btns"><button className="btn" onClick={() => toast('Se envió a la paciente una invitación para agendar.')}>Agendar cita</button><button className="btn ghost" onClick={() => toast('Abra Seguimiento para escribir el plan.')}>Enviar plan</button></div>
        </>}
      </Drawer>
    </>
  )
}

function Preevaluaciones({ d, focus, setFocus, toast }) {
  const list = [...d.preevals].sort((a, b) => (a.reviewed - b.reviewed) || (a.priority === 'alta' ? -1 : 1) - (b.priority === 'alta' ? -1 : 1))
  const sel = list.find(p => p.folio === focus) || list[0]
  const [view, setView] = useState('front')
  if (!sel) return null
  const back = sel.zones?.some(z => ['lumbar', 'sacro', 'muslo-post'].includes(z))
  return (
    <>
      <div className="page-h"><div><h1>Preevaluaciones</h1><p>Casos nuevos ordenados por prioridad · descifrados solo en su sesión 🔒</p></div></div>
      <div className="split">
        <div className="card list">
          {list.map(p => <button key={p.folio} className={'li' + (p.folio === sel.folio ? ' on' : '')} onClick={() => setFocus(p.folio)}>
            <div className="li-top"><b>{p.name}</b>{!p.reviewed && <span className="dot p" />}</div>
            <small>{p.folio} · {p.motive[0]}</small>
            <div className="li-bot">{p.priority === 'alta' ? <span className="badge r sm">Prioritaria</span> : <span className="badge n sm">Normal</span>}{p.demo && <span className="badge p sm">Tu demo</span>}<span className="muted sm">{p.date}</span></div>
          </button>)}
        </div>
        <div className="card detail">
          <div className="det-h"><div><h2>{sel.name} <span className="muted">· {sel.age} años</span></h2><small>{sel.folio} · enviada {sel.date} · {sel.booked ? 'Cita: ' + sel.booked : 'Aún sin cita'}</small></div><Prio p={sel.priority} /></div>
          <div className="aibox"><AI /><p>{sel.summary}</p><small>Preparado por IA a partir de las respuestas de la paciente. Revíselo antes de usarlo.</small></div>
          <div className="det-grid">
            <div className="det-map">
              {(sel.zones?.length > 0) && <>
                <React.Suspense fallback={<div className="b3d-stage" style={{ height: 340 }} />}>
                  <Body3D key={sel.folio} readOnly compact height={340} selected={sel.zones} initialView={sel.zones.every(isBackZone) ? 'back' : 'front'} />
                </React.Suspense>
                <div className="intensity"><span>Intensidad habitual</span><b>{sel.intensity}/10</b><div className="ibar"><i style={{ width: sel.intensity * 10 + '%' }} /></div></div>
              </>}
              {sel.breast?.length > 0 && <><h4>Mapa de mama</h4><BreastMap selected={sel.breast} readOnly size={240} /></>}
              {!sel.zones?.length && !sel.breast?.length && <p className="muted">Sin dolor marcado.</p>}
            </div>
            <div className="det-info">
              <h4>Motivo</h4><div className="chips">{sel.motive.map(x => <span className="pill" key={x}>{x}</span>)}</div>
              {(sel.zones?.length > 0 || sel.breast?.length > 0) && <><h4>Zonas marcadas</h4><p>{[...(sel.zones || []).map(z => ZONES_LABEL[z]), ...(sel.breast || []).map(b => BREAST_LABEL[b])].join(', ')}</p></>}
              {sel.symptoms?.length > 0 && <><h4>Síntomas</h4><p>{sel.symptoms.join(', ')}</p></>}
              <h4>Perfil</h4>
              {Object.entries({ 'Embarazo actual': sel.profile.embarazo, 'Última regla': sel.profile.regla, 'Ciclos': sel.profile.ciclos, 'Método u hormonas': sel.profile.metodo, 'Enfermedades': sel.profile.enfermedades, 'Alergias': sel.profile.alergias }).map(([k, v]) => <div className="kv sm" key={k}><span>{k}</span><b>{v}</b></div>)}
              <h4>Antecedentes</h4>
              {Object.entries({ 'Embarazos': sel.history.embarazos, 'Cirugías': sel.history.cirugias, 'Papanicolaou': sel.history.papanicolaou, 'Familia': sel.history.familia }).map(([k, v]) => <div className="kv sm" key={k}><span>{k}</span><b>{v}</b></div>)}
              <h4>Lo que le preocupa</h4><p>{sel.worries.join(', ') || '—'}</p>{sel.note && <blockquote>“{sel.note}”</blockquote>}
              <h4>Estudios</h4>{sel.studies.length ? sel.studies.map(s => <div className="file" key={s}>📄 {s}</div>) : <p className="muted">Sin estudios</p>}
            </div>
          </div>
          <div className="btns">
            <button className="btn" onClick={() => { if (sel.demo) d.setSubs(updateSub(sel.folio, { reviewed: true })); toast('Marcada como revisada.') }}>Marcar como revisada</button>
            <button className="btn ghost" onClick={() => toast('Se copió al expediente: resumen, zonas y antecedentes.')}>Pasar a mi expediente</button>
            {!sel.booked && <button className="btn ghost" onClick={() => toast('Se envió a la paciente el botón para agendar.')}>Invitar a agendar</button>}
          </div>
        </div>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> lo que cada paciente nueva le contó antes de verla. La prioridad la calculan reglas que usted define; la IA solo prepara el resumen de arriba.</div>
    </>
  )
}

function Mensajes({ toast }) {
  const [threads, setThreads] = useState(THREADS)
  const [id, setId] = useState(THREADS[0].id)
  const [txt, setTxt] = useState('')
  const t = threads.find(x => x.id === id)
  const send = () => {
    if (!txt.trim()) return
    setThreads(ts => ts.map(x => x.id === id ? { ...x, unread: false, messages: [...x.messages, { from: 'd', text: txt, time: 'Ahora' }] } : x))
    setTxt(''); toast('Enviado. La paciente lo recibe en su WhatsApp.')
  }
  return (
    <>
      <div className="page-h"><div><h1>Mensajes</h1><p>Solo lo que la asistente no puede resolver le llega aquí</p></div></div>
      <div className="split">
        <div className="card list">
          {threads.map(x => <button key={x.id} className={'li' + (x.id === id ? ' on' : '')} onClick={() => setId(x.id)}>
            <div className="li-top"><b>{x.name}</b>{x.unread && <span className="dot p" />}</div><small>{x.kind}</small><div className="li-bot"><span className="muted sm">{x.when}</span></div></button>)}
        </div>
        <div className="card detail chat">
          <div className="det-h"><div><h2>{t.name}</h2><small>{t.phone} · {t.kind}</small></div></div>
          <div className="aibox"><AI>Resumen de la conversación</AI><p>{t.summary}</p></div>
          <div className="thread">{t.messages.map((m, i) => <div key={i} className={'tm ' + m.from}><small>{m.from === 'p' ? t.name.split(' ')[0] : m.from === 'a' ? 'Asistente' : 'Usted'} · {m.time}</small><div>{m.text}</div></div>)}</div>
          <div className="reply"><textarea className="inp" rows="2" value={txt} onChange={e => setTxt(e.target.value)} placeholder="Escriba su respuesta…" /><button className="btn" onClick={send}>Enviar por WhatsApp</button></div>
        </div>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> su bandeja. Cuando una paciente hace una pregunta médica o un caso especial, la IA le pasa la conversación con un resumen. Usted responde aquí y la paciente lo recibe en WhatsApp.</div>
    </>
  )
}

function Seguimiento({ toast }) {
  const [tab, setTab] = useState('planes')
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="page-h"><div><h1>Seguimiento</h1><p>Planes de tratamiento, controles y mensajes programados</p></div><button className="btn" onClick={() => setOpen(true)}>+ Nuevo plan</button></div>
      <div className="seg mb"><button className={tab === 'planes' ? 'on' : ''} onClick={() => setTab('planes')}>Planes enviados</button><button className={tab === 'controles' ? 'on' : ''} onClick={() => setTab('controles')}>Controles</button><button className={tab === 'prog' ? 'on' : ''} onClick={() => setTab('prog')}>Programados</button></div>
      {tab === 'planes' && <div className="card table-wrap"><table className="tbl"><thead><tr><th>Paciente</th><th>Plan</th><th className="hide-sm">Control</th><th>Estado</th></tr></thead>
        <tbody>{PLANS.map(p => <tr key={p.id}><td><b>{p.name}</b><small>{p.date}</small></td><td>{p.title}</td><td className="hide-sm">{p.control}</td><td><span className="badge g">{p.status}</span></td></tr>)}</tbody></table></div>}
      {tab === 'controles' && <div className="card">{CONTROLS.map(c => <div className="row-appt" key={c.name}><div className="grow"><b>{c.name}</b><small>{c.reason}</small></div><span className={'badge ' + (c.due === 'Vencido' ? 'r' : 'n')}>{c.due}</span><button className="btn sm ghost" onClick={() => toast(`Se envió a ${c.name.split(' ')[0]} un recordatorio para agendar.`)}>{c.action === 'Programado' ? 'Ver' : c.action}</button></div>)}</div>}
      {tab === 'prog' && <div className="card">{REMINDERS.map(r => <div className="row-appt" key={r.what}><b className="time wide">{r.when}</b><div className="grow">{r.what}</div><span className="badge n">{r.kind}</span></div>)}</div>}
      <div className="explain"><b>Qué es esta pantalla:</b> lo que pasa después de la consulta. Usted escribe el plan; el sistema lo entrega por WhatsApp, recuerda los controles y avisa si alguien se atrasa.</div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Nuevo plan de tratamiento">
        <label className="lbl">Paciente</label><select className="inp"><option>Ana Rodríguez</option><option>Lucía Gómez</option><option>Carolina Pérez</option></select>
        <label className="lbl">Plantilla</label><select className="inp"><option>Plan después de primera consulta</option><option>Indicaciones post colposcopía</option><option>Control prenatal</option></select>
        <label className="lbl">Indicaciones</label>
        <textarea className="inp" rows="7" defaultValue={'Hola Ana, gracias por tu consulta de hoy.\n\n1. Ultrasonido pélvico transvaginal en los próximos 7 días.\n2. Anota en tu calendario los días de dolor y su intensidad.\n3. Para el dolor, sigue la indicación que te di en consulta.\n\nTu cita de control: en 3 semanas, con tus resultados.'} />
        <label className="check"><input type="checkbox" defaultChecked /><span>Recordarle su cita de control en 3 semanas</span></label>
        <button className="btn block" onClick={() => { setOpen(false); toast('Plan enviado por WhatsApp y control programado.') }}>Enviar por WhatsApp</button>
      </Drawer>
    </>
  )
}

function Bars({ data, labels, color = '#6B46C1', h = 150, fmt = v => v }) {
  const max = Math.max(...data) * 1.15
  const w = 100 / data.length
  return (
    <svg viewBox={`0 0 300 ${h + 30}`} width="100%" role="img">
      {[0.25, 0.5, 0.75, 1].map(f => <line key={f} x1="0" x2="300" y1={h - h * f} y2={h - h * f} stroke="#EFEAF5" />)}
      {data.map((v, i) => {
        const bh = (v / max) * h, x = (i * w + w * 0.2) * 3, bw = w * 0.6 * 3
        return <g key={i}><rect x={x} y={h - bh} width={bw} height={bh} rx="4" fill={i === data.length - 1 ? color : color + '66'} />
          <text x={x + bw / 2} y={h - bh - 5} textAnchor="middle" fontSize="10" fill="#2D2B32" fontWeight="600">{fmt(v)}</text>
          <text x={x + bw / 2} y={h + 16} textAnchor="middle" fontSize="10" fill="#8a8590">{labels[i]}</text></g>
      })}
    </svg>
  )
}
function HBars({ rows, color }) {
  const max = Math.max(...rows.map(r => r[1]))
  return <div className="hbars">{rows.map(([k, v]) => <div key={k} className="hb"><span>{k}</span><div><i style={{ width: (v / max) * 100 + '%', background: color }} /></div><b>{v}%</b></div>)}</div>
}

function Estadisticas() {
  const [range, setRange] = useState('Mes')
  const conv = STATS.converted.map((c, i) => Math.round((c / STATS.newProspects[i]) * 100))
  return (
    <>
      <div className="page-h"><div><h1>Estadísticas</h1><p>Cómo va su consulta · datos de ejemplo</p></div>
        <div className="seg">{['Semana', 'Mes', 'Año'].map(r => <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>)}</div></div>
      <div className="kpis">
        <div className="kpi"><small>Pacientes atendidas</small><b>71</b><span className="up">+8% vs octubre</span></div>
        <div className="kpi"><small>Prospectos nuevos</small><b className="pink">38</b><span className="up">+23% vs octubre</span></div>
        <div className="kpi"><small>De prospecto a cita</small><b className="green">63%</b><span className="up">antes 50%</span></div>
        <div className="kpi"><small>Inasistencias</small><b>4%</b><span className="up">antes 15%, con recordatorios</span></div>
      </div>
      <div className="grid2">
        <div className="card"><div className="card-h"><h3>Pacientes atendidas por mes</h3></div><Bars data={STATS.attended} labels={STATS.months} /></div>
        <div className="card"><div className="card-h"><h3>Prospectos que se convierten en cita</h3></div><Bars data={conv} labels={STATS.months} color="#10B981" fmt={v => v + '%'} /></div>
        <div className="card"><div className="card-h"><h3>Motivos de consulta</h3></div><HBars rows={STATS.motives} color="#6B46C1" /></div>
        <div className="card"><div className="card-h"><h3>De dónde llegan</h3></div><HBars rows={STATS.sources} color="#F472B6" /></div>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> los números para decidir. Por ejemplo, si Instagram trae más pacientes de lo que pensaba, o qué servicios crecen.</div>
    </>
  )
}

function Conocimiento({ toast }) {
  const [kb, setKb] = useState(KB)
  const [ask, setAsk] = useState('')
  const [ans, setAns] = useState(null)
  const all = kb.flatMap(c => c.items)
  const test = () => {
    const s = ask.toLowerCase()
    const hit = all.find(i => i.q.toLowerCase().split(/\W+/).filter(w => w.length > 4).some(w => s.includes(w)))
    setAns(hit ? hit.a : 'No tengo esa información aprobada. Se la pasaría a usted con un resumen.')
  }
  return (
    <>
      <div className="page-h"><div><h1>Base de conocimiento</h1><p>Lo que la asistente sabe y puede responder. Usted lo controla.</p></div></div>
      <div className="card tester"><b>Pruebe a la asistente</b><div className="reply"><input className="inp" placeholder="Ej. ¿Tienen estacionamiento?" value={ask} onChange={e => setAsk(e.target.value)} onKeyDown={e => e.key === 'Enter' && test()} /><button className="btn" onClick={test}>Preguntar</button></div>{ans && <div className="aibox"><AI>Respuesta de la asistente</AI><p>{ans}</p></div>}</div>
      {kb.map((c, ci) => <div className="card" key={c.cat}><div className="card-h"><h3>{c.cat}</h3></div>
        {c.items.map((it, ii) => <div className="kb" key={it.q}><b>{it.q}</b>
          <textarea className="inp" rows="2" value={it.a} onChange={e => setKb(k => k.map((cc, x) => x !== ci ? cc : { ...cc, items: cc.items.map((t, y) => y !== ii ? t : { ...t, a: e.target.value }) }))} /></div>)}
        <button className="btn ghost sm" onClick={() => toast('Cambios guardados. La asistente ya usa la nueva versión.')}>Guardar cambios</button>
      </div>)}
      <div className="explain"><b>Qué es esta pantalla:</b> la “memoria” de la asistente. Si cambia un precio o un horario aquí, la asistente responde con el dato nuevo de inmediato. Nunca inventa información fuera de esta lista.</div>
    </>
  )
}

function Horarios({ toast }) {
  const [hours, setHours] = useState(HOURS)
  return (
    <>
      <div className="page-h"><div><h1>Horarios y bloqueos</h1><p>La asistente solo ofrece los espacios que usted deja libres</p></div></div>
      <div className="grid2">
        <div className="card"><div className="card-h"><h3>Horario de consulta</h3></div>
          {hours.map((h, i) => <div className="row-appt" key={h.day}><label className="switch"><input type="checkbox" checked={h.on} onChange={e => setHours(hs => hs.map((x, j) => j === i ? { ...x, on: e.target.checked } : x))} /><i /></label><b className="grow">{h.day}</b><span className="muted">{h.on ? `${h.from} – ${h.to}` : 'Cerrado'}</span></div>)}
        </div>
        <div className="card"><div className="card-h"><h3>Duración por tipo de cita</h3></div>
          {Object.entries(TYPES).map(([k, v]) => <div className="row-appt" key={k}><i className="sw" style={{ background: v.color }} /><span className="grow">{k}</span><b>{v.min} min</b></div>)}
        </div>
      </div>
      <div className="card"><div className="card-h"><h3>Días y horas bloqueados</h3><button className="btn sm" onClick={() => toast('Bloqueo agregado. La asistente dejará de ofrecer ese horario.')}>+ Bloquear</button></div>
        {BLOCKS.map(b => <div className="row-appt" key={b.label}><b className="time wide">{DAYS.find(x => x.key === b.date)?.label}</b><span className="grow">{b.label}</span><span className="muted">{b.from} – {b.to}</span></div>)}
        <div className="row-appt"><b className="time wide">22 – 30 dic</b><span className="grow">Vacaciones</span><span className="muted">Todo el día</span></div>
      </div>
      <div className="explain"><b>Qué es esta pantalla:</b> su disponibilidad. Vacaciones, congresos o cirugías se bloquean aquí o en su Google Calendar, y la asistente deja de ofrecerlos.</div>
    </>
  )
}

function Ajustes({ toast }) {
  const notes = [['Agenda del día cada mañana (7:30)', true], ['Alertas de urgencia', true], ['Preevaluaciones prioritarias', true], ['Citas nuevas, cambios y cancelaciones', true], ['Preguntas médicas de pacientes', true], ['Resumen semanal de estadísticas', false]]
  return (
    <>
      <div className="page-h"><div><h1>Ajustes y privacidad</h1><p>Qué le llega, qué dicen los mensajes y quién puede ver los datos</p></div></div>
      <div className="grid2">
        <div className="card"><div className="card-h"><h3>Avisos a su WhatsApp personal</h3></div>
          {notes.map(([n, on]) => <div className="row-appt" key={n}><label className="switch"><input type="checkbox" defaultChecked={on} /><i /></label><span className="grow">{n}</span></div>)}
        </div>
        <div className="card priv"><div className="card-h"><h3>Privacidad 🔒</h3></div>
          <div className="okline">✓ Cifrado de extremo a extremo activo</div>
          <div className="kv sm"><span>Datos de salud</span><b>AES-256-GCM · solo usted los descifra</b></div>
          <div className="kv sm"><span>Acceso al panel</span><b>Contraseña + passkey</b></div>
          <div className="kv sm"><span>Código de recuperación</span><b>Impreso el 3 nov 2026</b></div>
          <div className="kv sm"><span>Dispositivos con acceso</span><b>MacBook · iPhone</b></div>
          <div className="kv sm"><span>Aviso de privacidad</span><b>Versión 1.0 · vigente</b></div>
          <button className="btn ghost sm" onClick={() => toast('Se cerró la sesión en los demás dispositivos.')}>Cerrar sesión en otros dispositivos</button>
        </div>
      </div>
      <div className="card"><div className="card-h"><h3>Mensajes automáticos</h3></div>
        {[['Recordatorio 24 h', 'Hola {nombre}, te recordamos tu cita de mañana {fecha} a las {hora} con la Dra. Sofía Morales. ¿Nos confirmas?'], ['Seguimiento a prospecto (24 h)', 'Hola {nombre}, ¿pudiste revisar los horarios? Con gusto te ayudo a agendar tu consulta.'], ['Mensaje de urgencias', 'Por lo que describes, necesitas atención inmediata. Acude a urgencias o llama al 911.']].map(([k, v]) =>
          <div className="kb" key={k}><b>{k}</b><textarea className="inp" rows="2" defaultValue={v} /></div>)}
      </div>
      <div className="card"><div className="card-h"><h3>Demo</h3></div><p className="muted">Borra los casos que creó en la vista de paciente.</p><button className="btn ghost sm" onClick={() => { resetDemo(); toast('Demo reiniciada.'); setTimeout(() => location.reload(), 600) }}>Reiniciar demo</button></div>
      <div className="explain"><b>Qué es esta pantalla:</b> el control de lo que le llega y de la seguridad. Los textos de los mensajes automáticos los aprueba usted.</div>
    </>
  )
}

/* ------------ vista doctora ------------ */

export default function DoctorView({ section, nav, goPatient, goHome }) {
  const d = useData()
  const [toast, setToast] = useToast()
  const [focus, setFocus] = useState(null)
  const openPre = folio => { setFocus(folio); nav('preevaluaciones') }
  const counts = { prospectos: d.prospects.filter(p => p.stage === 'nuevo' || p.demo).length, preevaluaciones: d.preevals.filter(p => !p.reviewed).length, mensajes: 2 }
  const S = section || 'inicio'
  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="brand"><i />Mi consulta</div>
        <nav>{SECTIONS.map(([k, l, ic]) => <button key={k} className={'nav' + (S === k ? ' on' : '')} onClick={() => nav(k)}><span className="ic">{ic}</span><span className="nl">{l}</span>{counts[k] ? <em>{counts[k]}</em> : null}</button>)}</nav>
        <div className="side-foot"><button className="link" onClick={goPatient}>Ver vista de paciente →</button><button className="link" onClick={goHome}>Inicio de la demo</button></div>
      </aside>
      <main className="main">
        <div className="topbar"><span className="demo-pill">Demo · datos ficticios</span><div className="me"><span>Dra. Sofía Morales</span><i>PI</i></div></div>
        <div className="content">
          {S === 'inicio' && <Inicio d={d} nav={nav} openPre={openPre} />}
          {S === 'agenda' && <Agenda d={d} openPre={openPre} toast={setToast} />}
          {S === 'prospectos' && <Prospectos d={d} openPre={openPre} toast={setToast} />}
          {S === 'pacientes' && <Pacientes openPre={openPre} toast={setToast} />}
          {S === 'preevaluaciones' && <Preevaluaciones d={d} focus={focus} setFocus={setFocus} toast={setToast} />}
          {S === 'mensajes' && <Mensajes toast={setToast} />}
          {S === 'seguimiento' && <Seguimiento toast={setToast} />}
          {S === 'estadisticas' && <Estadisticas />}
          {S === 'conocimiento' && <Conocimiento toast={setToast} />}
          {S === 'horarios' && <Horarios toast={setToast} />}
          {S === 'ajustes' && <Ajustes toast={setToast} />}
        </div>
      </main>
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  )
}
