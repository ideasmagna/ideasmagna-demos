import React, { Suspense, useEffect, useRef, useState } from 'react'
import { BreastMap } from './BodyMap.jsx'
const Body3D = React.lazy(() => import('./Body3D.jsx'))
import { CLINIC, FREE_SLOTS, KB, ZONES_LABEL, BREAST_LABEL } from './data.js'
import { addSub, updateSub, nextFolio, nowLabel } from './store.js'

/* ---------------- WhatsApp simulado ---------------- */

const T = () => {
  const d = new Date()
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}
const kb = q => KB.flatMap(c => c.items).find(i => i.q === q)?.a || ''

function Chat({ onOpenPreeval, pendingFolio, clearPending }) {
  const [msgs, setMsgs] = useState([])
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [sheet, setSheet] = useState(null)
  const [ctx, setCtx] = useState({ name: '', folio: null, priority: 'normal' })
  const bodyRef = useRef(null)

  const say = (list, delay = 650) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(m => [...m.map(x => ({ ...x, old: true })), ...list.map(x => ({ from: 'a', time: T(), ...x }))])
    }, delay)
  }
  const me = t => setMsgs(m => [...m.map(x => ({ ...x, old: true })), { from: 'p', text: t, time: T() }])

  const start = () => {
    setMsgs([])
    say([{ text: '¡Hola! Soy la asistente virtual del consultorio de la Dra. Sofía Morales. ¿En qué te puedo ayudar?', buttons: [
      { label: 'Agendar una cita', act: 'agendar' }, { label: 'Ubicación', act: 'faq:¿Dónde está el consultorio?' }, { label: 'Costo de consulta', act: 'faq:¿Cuánto cuesta la consulta?' },
    ] }], 400)
  }
  useEffect(() => { if (!pendingFolio) start() }, [])
  useEffect(() => { bodyRef.current && (bodyRef.current.scrollTop = bodyRef.current.scrollHeight) }, [msgs, typing])

  useEffect(() => {
    if (!pendingFolio) return
    const { folio, name, priority } = pendingFolio
    setCtx({ name, folio, priority })
    clearPending()
    setMsgs(m => [...m.map(x => ({ ...x, old: true })), { from: 'p', text: `Hola, terminé mi preevaluación, folio ${folio}`, time: T() }])
    say([
      { text: `¡Gracias, ${name.split(' ')[0] || 'bienvenida'}! La Dra. Sofía ya recibió tu preevaluación y la revisará antes de tu consulta.`, ai: true },
      { text: priority === 'alta' ? 'Por lo que nos contaste, conviene que la doctora te vea pronto. Estos son los horarios más cercanos:' : 'Estos son los próximos horarios disponibles:', buttons: slotButtons() },
    ], 900)
  }, [pendingFolio])

  const slotButtons = () => FREE_SLOTS.slice(0, 3).map((s, i) => ({ label: s.label, act: 'slot:' + i }))

  const act = (a, label) => {
    if (label) me(label)
    if (a === 'agendar') return say([{ text: 'Con gusto. Antes de empezar: usamos tus datos solo para tu atención, según el aviso de privacidad del consultorio. ¿Estás de acuerdo?', buttons: [{ label: 'Acepto', act: 'acepto' }, { label: 'Ver aviso', act: 'aviso' }] }])
    if (a === 'aviso') return say([{ text: 'Aviso de privacidad (resumen): la Dra. Sofía Morales es responsable de tus datos. Solo guardamos tu nombre, teléfono y tipo de consulta en este chat. Puedes pedir que se borren cuando quieras.', buttons: [{ label: 'Acepto', act: 'acepto' }] }])
    if (a === 'acepto') return say([{ text: 'Gracias. Una pregunta de seguridad: ¿tienes en este momento sangrado abundante, fiebre, dolor muy intenso o, si estás embarazada, pérdida de líquido?', tag: 'Filtro de urgencias · reglas fijas', buttons: [{ label: 'Sí', act: 'urg-si' }, { label: 'No', act: 'urg-no' }] }])
    if (a === 'urg-si') return say([{ text: 'Por lo que describes, necesitas atención inmediata. Acude a urgencias ahora o llama al 911. Urgencias del Torre Médica NovaSalud: Camino Santa Teresa 1055. Ya le avisé a la doctora.', demo: [{ label: 'Volver a empezar', act: 'reset' }] }])
    if (a === 'urg-no') return say([{ text: '¡Qué bueno! ¿Es tu primera consulta con la doctora?', buttons: [{ label: 'Sí, primera vez', act: 'primera' }, { label: 'Ya soy paciente', act: 'horarios' }] }])
    if (a === 'primera') return say([{ text: 'Bienvenida. Para que la doctora conozca tu caso antes de verte, te invito a llenar tu preevaluación. Toma unos 8 minutos y al final eliges tu horario.', cta: { label: 'Llenar preevaluación', act: 'llenar' } }, { text: 'Si prefieres agendar sin llenarla, también puedes.', buttons: [{ label: 'Ver horarios', act: 'horarios' }] }])
    if (a === 'llenar') { onOpenPreeval(); return }
    if (a === 'horarios') return say([{ text: 'Estos son los próximos horarios disponibles:', ai: true, buttons: slotButtons() }])
    if (a.startsWith('slot:')) {
      const s = FREE_SLOTS[Number(a.split(':')[1])]
      if (ctx.folio) updateSub(ctx.folio, { booked: s.label.replace('Hoy · ', 'Hoy · ') })
      return say([{ text: `¡Listo! Tu cita quedó el ${s.label.toLowerCase()} en ${CLINIC.place}. Te llegará un recordatorio un día antes. Lleva tus estudios previos y la fecha de tu última regla.`, demo: [{ label: 'Simular recordatorio de 24 h', act: 'recordatorio' }, { label: 'Volver a empezar', act: 'reset' }] }])
    }
    if (a === 'recordatorio') return say([{ text: 'Hola, te recordamos tu cita de mañana con la Dra. Sofía Morales. ¿Nos confirmas tu asistencia?', tag: 'Mensaje automático con plantilla aprobada por Meta', buttons: [{ label: 'Confirmo', act: 'confirmo' }, { label: 'Necesito cambiarla', act: 'horarios' }] }])
    if (a === 'confirmo') return say([{ text: '¡Gracias! Tu cita está confirmada. Te esperamos.', demo: [{ label: 'Volver a empezar', act: 'reset' }] }])
    if (a === 'reset') { setCtx({ name: '', folio: null, priority: 'normal' }); return start() }
    if (a.startsWith('faq:')) {
      const q = a.slice(4)
      return say([{ text: kb(q), ai: true, buttons: [{ label: 'Agendar una cita', act: 'agendar' }, { label: 'Otra pregunta', act: 'otra' }] }])
    }
    if (a === 'otra') return say([{ text: 'Claro, escríbeme tu pregunta o elige una:', list: { button: 'Ver preguntas', rows: [{ label: 'Horario', act: 'faq:¿Cuál es el horario?' }, { label: 'Formas de pago', act: 'faq:¿Qué formas de pago aceptan?' }, { label: 'Preparar colposcopía', act: 'faq:¿Cómo me preparo para la colposcopía?' }, { label: 'Ubicación', act: 'faq:¿Dónde está el consultorio?' }, { label: 'Costo de consulta', act: 'faq:¿Cuánto cuesta la consulta?' }] } }])
  }

  const send = e => {
    e.preventDefault()
    const t = text.trim(); if (!t) return
    setText(''); me(t)
    const s = t.toLowerCase()
    if (/(desmay|mucho sangr|sangrado abundante|fiebre|no puedo respirar|líquido|liquido)/.test(s)) return act('urg-si')
    if (/(cita|agendar|consulta con|turno|horario disponible|martes|miércoles|miercoles|jueves|viernes|lunes|sábado|sabado|mañana|tarde)/.test(s)) return say([{ text: 'Entendido, te busco un espacio. Estos son los horarios que tengo:', ai: true, buttons: slotButtons() }])
    if (/(dónde|donde|ubicaci|direcci|llegar)/.test(s)) return act('faq:¿Dónde está el consultorio?')
    if (/(cuesta|precio|costo|cobran)/.test(s)) return act('faq:¿Cuánto cuesta la consulta?')
    if (/(pago|tarjeta|transfer)/.test(s)) return act('faq:¿Qué formas de pago aceptan?')
    if (/(horario|abren|atienden)/.test(s)) return act('faq:¿Cuál es el horario?')
    if (/(colposc)/.test(s)) return act('faq:¿Cómo me preparo para la colposcopía?')
    if (/(dolor|tomar|medic|pastilla|ibuprofeno|duele|embaraz|síntoma|sintoma)/.test(s)) return say([{ text: 'Esa es una pregunta médica y prefiero que la responda la doctora. Ya se la pasé con un resumen y te contestará por aquí. Mientras tanto, ¿quieres agendar una consulta?', ai: true, buttons: [{ label: 'Agendar una cita', act: 'agendar' }] }])
    return say([{ text: 'Puedo ayudarte a agendar, cambiar o cancelar tu cita, o responder dudas sobre el consultorio, precios y preparación para estudios. ¿Qué necesitas?', ai: true, buttons: [{ label: 'Agendar una cita', act: 'agendar' }, { label: 'Otra pregunta', act: 'otra' }] }])
  }

  return (
    <div className="wa">
      <div className="wa-head">
        <div className="wa-av">P</div>
        <div><b>Consultorio Dra. Sofía Morales</b><span>{typing ? 'escribiendo…' : 'Cuenta de empresa'}</span></div>
      </div>
      <div className="wa-body" ref={bodyRef}>
        <div className="wa-day">HOY</div>
        {msgs.map((m, i) => (
          <React.Fragment key={i}>
          {(m.tag || m.ai) && <div className={'demo-note' + (m.ai ? ' ai' : '')}>{m.tag || 'Respuesta con IA (simulada en la demo)'}</div>}
          <div className={'bub ' + (m.from === 'p' ? 'me' : 'them')}>
            <div>{m.text}</div>
            <div className="bub-time">{m.time}</div>
            {m.buttons && (
              <div className="bub-btns">
                {m.buttons.map(b => <button key={b.label} disabled={m.old} onClick={() => act(b.act, b.label)}>{b.label}</button>)}
              </div>
            )}
            {m.cta && (
              <div className="bub-btns">
                <button onClick={() => act(m.cta.act)}>↗ {m.cta.label}</button>
              </div>
            )}
            {m.list && (
              <div className="bub-btns">
                <button disabled={m.old} onClick={() => setSheet(m.list)}>☰ {m.list.button}</button>
              </div>
            )}
          </div>
          {m.demo && !m.old && (
            <div className="demo-ctl"><span>Controles de la demo:</span>{m.demo.map(b => <button key={b.label} onClick={() => act(b.act)}>{b.label}</button>)}</div>
          )}
          </React.Fragment>
        ))}
        {typing && <div className="bub them typing"><i /><i /><i /></div>}
      </div>
      {sheet && (
        <div className="wa-sheet-bg" onClick={() => setSheet(null)}>
          <div className="wa-sheet" onClick={e => e.stopPropagation()}>
            <div className="wa-sheet-h"><button onClick={() => setSheet(null)}>✕</button><b>{sheet.button}</b></div>
            {sheet.rows.map(r => <label key={r.label}><input type="radio" name="wl" onChange={() => { setSheet(null); act(r.act, r.label) }} />{r.label}</label>)}
          </div>
        </div>
      )}
      <form className="wa-input" onSubmit={send}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Escribe un mensaje" />
        <button aria-label="Enviar">➤</button>
      </form>
    </div>
  )
}

/* ---------------- Preevaluación ---------------- */

const ALARM = [
  '¿Estás empapando por completo una toalla sanitaria en menos de una hora?',
  '¿Tienes un dolor pélvico o abdominal que apareció de repente y es muy intenso?',
  '¿Has tenido desmayo, mareo intenso o una debilidad que te dificulta estar de pie?',
  '¿Tienes fiebre junto con dolor en la pelvis?',
  'Si estás embarazada: ¿tienes sangrado o pérdida de líquido?',
]
const MOTIVES = ['Dolor pélvico o menstrual', 'Sangrado irregular o abundante', 'Embarazo o deseo de embarazo', 'Bolita, dolor o cambios en la mama', 'Menopausia y bochornos', 'Anticoncepción', 'Revisión preventiva', 'Revisar mis estudios', 'Segunda opinión']
const DISEASES = ['Ninguna', 'Diabetes', 'Presión alta', 'Tiroides', 'Síndrome de ovario poliquístico', 'Endometriosis', 'Anemia', 'Otra']
const SYMPTOMS = ['Dolor durante la regla', 'Dolor en relaciones', 'Dolor al orinar', 'Dolor al evacuar', 'Hinchazón abdominal', 'Presión en la pelvis', 'Flujo diferente']
const BREAST_SYM = ['Bolita nueva', 'Dolor', 'Cambio en la piel', 'Salida de líquido por el pezón', 'Cambio en el pezón']
const SURG = ['Ninguna', 'Cesárea', 'Laparoscopía', 'Histerectomía', 'Cirugía de mama', 'Otra']
const FAMILY = ['Ninguno', 'Cáncer de mama', 'Cáncer de ovario', 'Cáncer de útero', 'No lo sé']
const WORRIES = ['El dolor que siento', 'Que sea algo grave', 'No poder embarazarme', 'El sangrado', 'Que me operen', 'No tener un diagnóstico claro', 'El costo del tratamiento', 'Cómo afecta mi vida diaria']
const FACES = [[0, 'Sin dolor', '😌'], [2, 'Leve', '🙂'], [4, 'Moderado', '😐'], [6, 'Intenso', '😣'], [8, 'Muy intenso', '😖'], [10, 'Insoportable', '😫']]
const FACE_TEXT = { 0: 'No tengo dolor.', 2: 'Lo noto, pero no me molesta en mi día.', 4: 'Se nota y me distrae, pero puedo seguir con mis actividades.', 6: 'Me cuesta concentrarme y a veces dejo de hacer cosas.', 8: 'Me impide hacer mis actividades normales.', 10: 'Es el peor dolor que puedo imaginar.' }

function Chips({ options, value, onChange, single }) {
  const toggle = o => {
    if (single) return onChange(o)
    let v = value.includes(o) ? value.filter(x => x !== o) : [...value, o]
    if (o === 'Ninguna' || o === 'Ninguno') v = value.includes(o) ? [] : [o]
    else v = v.filter(x => x !== 'Ninguna' && x !== 'Ninguno')
    onChange(v)
  }
  return <div className="chips">{options.map(o => <button type="button" key={o} className={'chip' + ((single ? value === o : value.includes(o)) ? ' on' : '')} onClick={() => toggle(o)}>{o}</button>)}</div>
}

function Tip({ img, children, src }) {
  return (
    <div className="tip">
      <div className="tip-art">{img}</div>
      <div className="tip-body"><div className="tip-k">¿Sabías que…?</div><p>{children}</p><div className="tip-src">{src}</div></div>
      <div className="tip-fine">Información orientativa. No sustituye la consulta, el diagnóstico ni el tratamiento médico.</div>
    </div>
  )
}

const ArtCycle = () => (
  <svg viewBox="0 0 240 110" width="100%"><rect width="240" height="110" rx="12" fill="#F6F0FC" />
    {[0, 1, 2, 3, 4].map(i => <g key={i} transform={`translate(${22 + i * 42} 28)`}><rect width="34" height="44" rx="6" fill="#fff" stroke="#E3D6F5" /><rect width="34" height="10" rx="5" fill="#6B46C1" opacity=".75" />{[0, 1, 2].map(j => <circle key={j} cx={8 + j * 9} cy={24 + (i % 2) * 6} r="3" fill="#F472B6" opacity={0.4 + j * 0.2} />)}</g>)}
    <path d="M30 92 Q120 70 210 92" stroke="#F472B6" strokeWidth="2" fill="none" strokeDasharray="4 4" /></svg>
)
const ArtWoman = () => (
  <svg viewBox="0 0 240 110" width="100%"><rect width="240" height="110" rx="12" fill="#FDF0F7" />
    <circle cx="70" cy="55" r="34" fill="#F4EDFB" /><path d="M58 52 Q70 30 84 52 Q84 70 70 74 Q56 70 58 52Z" fill="#6B46C1" opacity=".8" /><circle cx="70" cy="56" r="8" fill="#F472B6" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <g key={i} transform={`translate(${126 + (i % 5) * 20} ${30 + Math.floor(i / 5) * 32})`}><circle cx="6" cy="5" r="5" fill={i === 0 ? '#F472B6' : '#D9C9EE'} /><rect x="1" y="11" width="10" height="13" rx="4" fill={i === 0 ? '#F472B6' : '#D9C9EE'} /></g>)}</svg>
)
const ArtCare = () => (
  <svg viewBox="0 0 240 110" width="100%"><rect width="240" height="110" rx="12" fill="#ECFAF4" />
    <rect x="30" y="22" width="76" height="66" rx="10" fill="#fff" stroke="#BFE9D6" /><path d="M44 40h48M44 54h36M44 68h42" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    <circle cx="162" cy="55" r="30" fill="#fff" stroke="#BFE9D6" /><path d="M148 56l10 10 20-22" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

function Preeval({ onBook, onExit }) {
  const STEPS = ['bienvenida', 'seguridad', 'privacidad', 'motivo', 'sobreti', 'tip1', 'mapa', 'tip2', 'antecedentes', 'preocupa', 'estudios', 'resumen', 'final']
  const [i, setI] = useState(0)
  const [urgent, setUrgent] = useState(false)
  const [view, setView] = useState('front')
  const [sub, setSub] = useState(null)
  const [a, setA] = useState({
    alarm: ALARM.map(() => null), consent: [false, false, false], name: '', phone: '', sign: '',
    motive: [], age: '', pregnant: '', lastPeriod: '', method: '', diseases: [], allergies: '',
    zones: [], breast: [], intensity: null, symptoms: [], breastSym: [], since: '',
    pregnancies: '', surgeries: [], pap: '', family: [], worries: [], note: '', files: [],
  })
  const set = (k, v) => setA(x => ({ ...x, [k]: v }))
  const step = STEPS[i]
  const mama = a.motive.includes('Bolita, dolor o cambios en la mama') || a.zones.some(z => z.startsWith('mama-'))
  const scrollTop = () => document.querySelector('.pv-scroll')?.scrollTo(0, 0)
  const go = n => { setI(n); scrollTop() }

  const canNext = () => {
    if (step === 'seguridad') return a.alarm.every(x => x !== null)
    if (step === 'privacidad') return a.consent.every(Boolean) && a.name.trim().length > 2 && a.phone.trim().length >= 8 && a.sign.trim().length > 2
    if (step === 'motivo') return a.motive.length > 0
    if (step === 'sobreti') return a.age && a.pregnant
    return true
  }
  const next = () => {
    if (step === 'seguridad' && a.alarm.some(x => x === true)) { setUrgent(true); return }
    if (step === 'resumen') {
      const priority = (a.intensity ?? 0) >= 7 || (mama && (a.breastSym.includes('Bolita nueva') || a.breast.length > 0)) ? 'alta' : 'normal'
      const zl = a.zones.map(z => ZONES_LABEL[z]).join(', ')
      const summary = `Paciente de ${a.age} años. Motivo: ${a.motive.join(', ').toLowerCase()}.` +
        (a.zones.length ? ` Refiere molestia en ${zl.toLowerCase()} con intensidad ${a.intensity ?? 0}/10.` : '') +
        (a.breast.length ? ` Marca en mapa de mama: ${a.breast.map(b => BREAST_LABEL[b]).join(', ').toLowerCase()}${a.breastSym.length ? ' (' + a.breastSym.join(', ').toLowerCase() + ')' : ''}.` : '') +
        (a.symptoms.length ? ` Síntomas asociados: ${a.symptoms.join(', ').toLowerCase()}.` : '') +
        (a.family.length && !a.family.includes('Ninguno') ? ` Antecedente familiar: ${a.family.join(', ').toLowerCase()}.` : '') +
        (a.worries.length ? ` Le preocupa: ${a.worries.join(', ').toLowerCase()}.` : '')
      const s = {
        folio: nextFolio(), name: a.name.trim(), age: Number(a.age) || a.age, date: nowLabel(), priority, booked: null, reviewed: false, demo: true,
        motive: a.motive, zones: a.zones, breast: a.breast, intensity: a.intensity ?? 0, symptoms: [...a.symptoms, ...a.breastSym],
        profile: { embarazo: a.pregnant, regla: a.lastPeriod || '—', ciclos: '—', metodo: a.method || '—', enfermedades: a.diseases.join(', ') || '—', alergias: a.allergies || 'Ninguna' },
        history: { embarazos: a.pregnancies || '—', cirugias: a.surgeries.join(', ') || '—', papanicolaou: a.pap || '—', familia: a.family.join(', ') || '—' },
        worries: a.worries, note: a.note, studies: a.files, summary,
      }
      addSub(s); setSub(s)
    }
    go(i + 1)
  }

  const progress = Math.round((i / (STEPS.length - 1)) * 100)

  if (urgent) return (
    <div className="pv"><div className="pv-scroll"><div className="pv-card urgent">
      <div className="pv-tag red">Atención inmediata</div>
      <h2>Por lo que nos cuentas, necesitas atención médica ahora</h2>
      <p>Acude de inmediato a urgencias o llama al <b>911</b>. No esperes a tu cita.</p>
      <div className="urg-box"><b>Urgencias · Torre Médica NovaSalud</b><br />Av. Principal 1055, Centro Empresarial</div>
      <a className="btn red block" href="tel:911">Llamar al 911</a>
      <label className="lbl">Si quieres, deja tu nombre y WhatsApp para que la doctora sepa de ti</label>
      <input className="inp" placeholder="Nombre" /><input className="inp" placeholder="WhatsApp (10 dígitos)" />
      <button className="btn ghost block" onClick={() => { setUrgent(false); set('alarm', ALARM.map(() => null)) }}>Volver (demo)</button>
    </div></div></div>
  )

  return (
    <div className="pv">
      <div className="pv-top">
        <button className="link" onClick={onExit}>← Salir</button>
        <div className="pv-brand">Dra. Sofía Morales</div>
        <div className="pv-saved">{i > 2 ? 'Guardado' : ''}</div>
      </div>
      {step !== 'final' && <div className="pv-bar"><i style={{ width: progress + '%' }} /></div>}
      <div className="pv-scroll">
        {step === 'bienvenida' && <div className="pv-card">
          <div className="pv-hero"><div className="avatar">PI</div><div><b>Dra. Sofía Morales</b><span>Ginecología, Obstetricia y Senología</span></div></div>
          <h2>Tu preevaluación antes de la primera consulta</h2>
          <p>En unos 8 minutos nos cuentas qué te pasa para que la doctora conozca tu caso antes de verte. Al final eliges tu horario por WhatsApp.</p>
          <ul className="ticks"><li>Tus respuestas se cifran y solo la doctora puede leerlas.</li><li>Puedes salir y retomarla después.</li><li>Es orientativa: no da diagnósticos ni sustituye la consulta.</li></ul>
        </div>}

        {step === 'seguridad' && <div className="pv-card">
          <div className="pv-tag">Paso 1 · Seguridad</div><h2>Primero, unas preguntas de seguridad</h2><p className="muted">Responde según cómo te sientes hoy.</p>
          {ALARM.map((q, k) => <div className="yn" key={k}><span>{q}</span><div>
            <button className={'chip' + (a.alarm[k] === true ? ' on red' : '')} onClick={() => set('alarm', a.alarm.map((v, j) => j === k ? true : v))}>Sí</button>
            <button className={'chip' + (a.alarm[k] === false ? ' on' : '')} onClick={() => set('alarm', a.alarm.map((v, j) => j === k ? false : v))}>No</button></div></div>)}
        </div>}

        {step === 'privacidad' && <div className="pv-card">
          <div className="pv-tag">Paso 2 · Privacidad</div><h2>Aviso de privacidad y consentimiento</h2>
          <p className="muted small">La Dra. Sofía Morales trata tus datos de contacto y de salud para preparar tu consulta. Tus respuestas se cifran en tu celular y solo ella puede leerlas. No es tu expediente clínico ni sustituye la consulta.</p>
          {['Preparación y seguimiento de mi consulta', 'Resumen de mis respuestas con inteligencia artificial, revisado por la doctora', 'Contacto por WhatsApp para coordinar mi cita'].map((t, k) =>
            <label className="check" key={k}><input type="checkbox" checked={a.consent[k]} onChange={e => set('consent', a.consent.map((v, j) => j === k ? e.target.checked : v))} /><span>{t} <em>· necesaria</em></span></label>)}
          <label className="lbl">Nombre completo</label><input className="inp" value={a.name} onChange={e => set('name', e.target.value)} placeholder="Ej. Ana Rodríguez" />
          <label className="lbl">WhatsApp</label><input className="inp" value={a.phone} onChange={e => set('phone', e.target.value)} placeholder="10 dígitos" inputMode="tel" />
          <label className="lbl">Firma: escribe tu nombre completo</label><input className="inp sign" value={a.sign} onChange={e => set('sign', e.target.value)} />
        </div>}

        {step === 'motivo' && <div className="pv-card">
          <div className="pv-tag">Paso 3 · Motivo</div><h2>¿Qué te gustaría entender o resolver?</h2><p className="muted">Elige todas las que se parezcan a lo que sientes.</p>
          <Chips options={MOTIVES} value={a.motive} onChange={v => set('motive', v)} />
        </div>}

        {step === 'sobreti' && <div className="pv-card">
          <div className="pv-tag">Paso 4 · Sobre ti</div><h2>Cuéntanos un poco de ti</h2>
          <label className="lbl">Edad</label><input className="inp short" value={a.age} onChange={e => set('age', e.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="Años" />
          <label className="lbl">¿Estás embarazada?</label><Chips single options={['Sí', 'No', 'No lo sé']} value={a.pregnant} onChange={v => set('pregnant', v)} />
          <label className="lbl">Fecha de tu última regla</label><input className="inp short" type="date" value={a.lastPeriod} onChange={e => set('lastPeriod', e.target.value)} />
          <label className="lbl">Método anticonceptivo u hormonas</label><Chips single options={['Ninguno', 'Pastillas', 'DIU', 'Implante', 'Inyección', 'Condón', 'Terapia hormonal']} value={a.method} onChange={v => set('method', v)} />
          <label className="lbl">¿Vives con alguna enfermedad?</label><Chips options={DISEASES} value={a.diseases} onChange={v => set('diseases', v)} />
          <label className="lbl">Alergias</label><input className="inp" value={a.allergies} onChange={e => set('allergies', e.target.value)} placeholder="Medicamentos, látex, yodo…" />
        </div>}

        {step === 'tip1' && <div className="pv-card"><Tip img={<ArtCycle />} src="Fuente: Colegio Americano de Obstetras y Ginecólogos (ACOG)">Es normal que los ciclos varíen un poco de mes a mes, pero los cambios importantes en duración o cantidad de sangrado conviene comentarlos con tu doctora. Anotar tus fechas ayuda a encontrar patrones.</Tip></div>}

        {step === 'mapa' && <div className="pv-card">
          <div className="pv-tag">Paso 5 · Mapa del cuerpo</div><h2>¿Dónde sientes la molestia?</h2><p className="muted">Toca una o varias zonas. Si no tienes dolor, sigue con “Continuar”.</p>
          <Suspense fallback={<div className="b3d-stage" style={{ height: 400 }}><div className="b3d-loading">Cargando modelo 3D…</div></div>}>
            <Body3D height={400} selected={a.zones} onToggle={z => set('zones', a.zones.includes(z) ? a.zones.filter(x => x !== z) : [...a.zones, z])} />
          </Suspense>
          {a.zones.length > 0 && <div className="chips sel">{a.zones.map(z => <span key={z} className="pill">{ZONES_LABEL[z]}</span>)}</div>}
          {mama && <>
            <h3>Mapa de mama</h3><p className="muted small">Marca dónde notas la bolita, el dolor o el cambio.</p>
            <BreastMap selected={a.breast} onToggle={z => set('breast', a.breast.includes(z) ? a.breast.filter(x => x !== z) : [...a.breast, z])} />
            {a.breast.length > 0 && <div className="chips sel">{a.breast.map(z => <span key={z} className="pill">{BREAST_LABEL[z]}</span>)}</div>}
            <label className="lbl">¿Qué notas?</label><Chips options={BREAST_SYM} value={a.breastSym} onChange={v => set('breastSym', v)} />
          </>}
          {(a.zones.length > 0 || (mama && a.breast.length > 0)) && <>
            <h3>¿Qué tan fuerte es tu molestia en un día normal?</h3>
            <div className="faces">{FACES.map(([n, l, e]) => <button key={n} className={'face' + (a.intensity === n ? ' on' : '')} onClick={() => set('intensity', n)}><span>{e}</span><b>{n}</b><small>{l}</small></button>)}</div>
            {a.intensity !== null && <div className="face-text"><b>{a.intensity}/10</b> · {FACE_TEXT[a.intensity]}</div>}
            {a.zones.length > 0 && <><label className="lbl">¿Notas alguno de estos síntomas?</label><Chips options={SYMPTOMS} value={a.symptoms} onChange={v => set('symptoms', v)} /></>}
          </>}
        </div>}

        {step === 'tip2' && <div className="pv-card"><Tip img={<ArtWoman />} src="Fuente: Organización Mundial de la Salud (OMS)">La endometriosis afecta a cerca de 1 de cada 10 mujeres en edad reproductiva, y con frecuencia pasan años antes de identificarla. Describir bien tu dolor ayuda a acortar ese camino.</Tip></div>}

        {step === 'antecedentes' && <div className="pv-card">
          <div className="pv-tag">Paso 6 · Antecedentes</div><h2>Tu historia</h2>
          <label className="lbl">¿Cuántos embarazos has tenido?</label><Chips single options={['0', '1', '2', '3 o más']} value={a.pregnancies} onChange={v => set('pregnancies', v)} />
          <label className="lbl">Cirugías ginecológicas o de mama</label><Chips options={SURG} value={a.surgeries} onChange={v => set('surgeries', v)} />
          <label className="lbl">Tu último Papanicolaou</label><Chips single options={['Menos de 1 año', '1 a 3 años', 'Más de 3 años', 'Nunca', 'No recuerdo']} value={a.pap} onChange={v => set('pap', v)} />
          <label className="lbl">Cáncer en tu familia</label><Chips options={FAMILY} value={a.family} onChange={v => set('family', v)} />
        </div>}

        {step === 'preocupa' && <div className="pv-card">
          <div className="pv-tag">Paso 7 · Lo que te preocupa</div><h2>¿Qué es lo que más te preocupa hoy?</h2><p className="muted">Esto ayuda a la doctora a saber qué esperas de tu consulta.</p>
          <Chips options={WORRIES} value={a.worries} onChange={v => set('worries', v)} />
          <label className="lbl">Cuéntalo con tus palabras (opcional)</label><textarea className="inp" rows="3" value={a.note} onChange={e => set('note', e.target.value)} />
        </div>}

        {step === 'estudios' && <div className="pv-card">
          <div className="pv-tag">Paso 8 · Estudios (opcional)</div><h2>Comparte tus estudios</h2><p className="muted">Ultrasonidos, laboratorios o notas médicas. La doctora los revisa contigo en consulta.</p>
          <label className="drop"><input type="file" multiple onChange={e => set('files', [...a.files, ...Array.from(e.target.files).map(f => f.name)])} /><b>Toca para elegir un archivo</b><span>PDF, JPG o PNG · en esta demo no se sube nada</span></label>
          {a.files.map(f => <div className="file" key={f}>📄 {f} <em>listo · cifrado</em></div>)}
        </div>}

        {step === 'resumen' && <div className="pv-card">
          <div className="pv-tag">Paso 9 · Resumen</div><h2>Revisa antes de enviar</h2>
          {[
            ['Contacto', `${a.name} · ${a.phone}`, 2], ['Motivo', a.motive.join(', '), 3], ['Sobre ti', `${a.age} años · embarazo: ${a.pregnant} · alergias: ${a.allergies || 'ninguna'}`, 4],
            ['Molestia', a.zones.length || a.breast.length ? `${[...a.zones.map(z => ZONES_LABEL[z]), ...a.breast.map(b => BREAST_LABEL[b])].join(', ')} · ${a.intensity ?? 0}/10` : 'Sin dolor', 6],
            ['Antecedentes', `Embarazos: ${a.pregnancies || '—'} · Papanicolaou: ${a.pap || '—'}`, 8], ['Te preocupa', a.worries.join(', ') || '—', 9], ['Estudios', a.files.join(', ') || 'Sin estudios', 10],
          ].map(([k, v, s]) => <div className="sumrow" key={k}><div><small>{k}</small><div>{v}</div></div><button className="link" onClick={() => go(s)}>Editar</button></div>)}
          <div className="note-box">Al enviar, tu preevaluación llega cifrada a la Dra. Sofía.</div>
        </div>}

        {step === 'final' && sub && <div className="pv-card final">
          <div className="okmark">✓</div>
          <div className="pv-tag">Folio {sub.folio}</div>
          <h2>Tu preevaluación fue enviada a la Dra. Sofía</h2>
          <p>Ella la revisará personalmente. En tu primera consulta te explicará tu diagnóstico y tu plan de tratamiento, con tu exploración y tus estudios.</p>
          <div className={'prio ' + sub.priority}>{sub.priority === 'alta' ? <><b>Te recomendamos consulta esta semana.</b> Por lo que nos contaste, conviene que la doctora te valore pronto.</> : <><b>Puedes agendar en las próximas semanas.</b> Elige el horario que mejor te acomode.</>}</div>
          <div className="prep"><b>Para tu consulta, lleva:</b><ul><li>Tus estudios previos</li><li>La fecha de tu última regla</li><li>La lista de medicamentos que tomas</li></ul></div>
          <button className="btn wa block" onClick={() => onBook(sub)}>Agendar mi primera consulta por WhatsApp</button>
          <Tip img={<ArtCare />} src="Texto aprobado por la Dra. Sofía">Llegar con tu información ordenada hace que tu consulta rinda más: la doctora dedica ese tiempo a explicarte y a resolver tus dudas.</Tip>
        </div>}
      </div>
      {step !== 'final' && <div className="pv-nav">
        <button className="link" disabled={i === 0} onClick={() => go(i - 1)}>← Atrás</button>
        <button className="btn" disabled={!canNext()} onClick={next}>{step === 'bienvenida' ? 'Comenzar' : step === 'resumen' ? 'Enviar a la doctora' : step === 'privacidad' ? 'Aceptar y continuar' : 'Continuar'}</button>
      </div>}
      <div className="pv-foot">Herramienta orientativa del consultorio de la Dra. Sofía Morales. No emite diagnósticos ni sustituye la consulta médica.</div>
    </div>
  )
}

/* ---------------- Vista paciente ---------------- */

export default function PatientView({ goHome }) {
  const [tab, setTab] = useState('wa')
  const [pending, setPending] = useState(null)
  const [pvKey, setPvKey] = useState(0)
  return (
    <div className="pt-wrap">
      <aside className="pt-side">
        <button className="link" onClick={goHome}>← Inicio de la demo</button>
        <div className="eyebrow">Vista de la paciente</div>
        <h1>Así vive su paciente el sistema</h1>
        <p>Todo pasa en el WhatsApp que ya usa y en una página web con su nombre. No instala nada ni crea cuentas.</p>
        <ol className="howto">
          <li>En <b>WhatsApp</b>, toque “Agendar una cita” y siga los botones, o escriba con sus palabras.</li>
          <li>Cuando le ofrezca la <b>preevaluación</b>, llénela: pruebe el mapa del cuerpo y, si elige “mama”, el mapa de mama.</li>
          <li>Al final toque “Agendar por WhatsApp” y elija un horario.</li>
          <li>Después abra la <b>vista de la doctora</b>: su caso aparecerá en Preevaluaciones y Prospectos.</li>
        </ol>
        <p className="fine">Demo con datos ficticios. Las respuestas “con IA” están simuladas.</p>
      </aside>
      <div className="phone-area">
        <div className="seg top"><button className={tab === 'wa' ? 'on' : ''} onClick={() => setTab('wa')}>WhatsApp</button><button className={tab === 'pv' ? 'on' : ''} onClick={() => setTab('pv')}>Preevaluación web</button></div>
        <div className="phone">
          <div className="notch" />
          <div className={'screen' + (tab === 'wa' ? '' : ' hide')}><Chat onOpenPreeval={() => setTab('pv')} pendingFolio={pending} clearPending={() => setPending(null)} /></div>
          <div className={'screen' + (tab === 'pv' ? '' : ' hide')}><Preeval key={pvKey} onExit={() => setTab('wa')} onBook={s => { setPending({ folio: s.folio, name: s.name, priority: s.priority }); setTab('wa'); setPvKey(k => k + 1) }} /></div>
        </div>
      </div>
    </div>
  )
}
