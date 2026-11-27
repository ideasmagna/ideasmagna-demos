import React from 'react'

const FRONT = [
  { id: 'abdomen-alto', cx: 100, cy: 140, rx: 26, ry: 14 },
  { id: 'ombligo', cx: 100, cy: 170, rx: 18, ry: 11 },
  { id: 'bajo-vientre', cx: 100, cy: 204, rx: 21, ry: 12 },
  { id: 'fosa-der', cx: 75, cy: 198, rx: 9, ry: 13 },
  { id: 'fosa-izq', cx: 125, cy: 198, rx: 9, ry: 13 },
  { id: 'ingle-der', cx: 80, cy: 230, rx: 8, ry: 7 },
  { id: 'ingle-izq', cx: 120, cy: 230, rx: 8, ry: 7 },
  { id: 'genital', cx: 100, cy: 242, rx: 10, ry: 10 },
  { id: 'muslo-der', cx: 80, cy: 292, rx: 13, ry: 28 },
  { id: 'muslo-izq', cx: 120, cy: 292, rx: 13, ry: 28 },
]
const BACK = [
  { id: 'lumbar', cx: 100, cy: 188, rx: 28, ry: 15 },
  { id: 'sacro', cx: 100, cy: 230, rx: 30, ry: 17 },
  { id: 'muslo-post', cx: 80, cy: 292, rx: 13, ry: 28 },
  { id: 'muslo-post', cx: 120, cy: 292, rx: 13, ry: 28, dup: true },
]

function Silhouette({ back }) {
  return (
    <g fill={back ? '#EFE7F8' : '#F4EDFB'} stroke="#D9C9EE" strokeWidth="1.2">
      <path d="M60 90 Q46 96 44 120 L36 190 L30 248 Q34 257 41 252 L50 196 L61 140 Z" />
      <path d="M140 90 Q154 96 156 120 L164 190 L170 248 Q166 257 159 252 L150 196 L139 140 Z" />
      <path d="M64 234 Q58 300 69 360 L71 388 Q80 395 89 388 L90 330 Q96 292 100 262 Z" />
      <path d="M136 234 Q142 300 131 360 L129 388 Q120 395 111 388 L110 330 Q104 292 100 262 Z" />
      <path d="M62 88 Q100 78 138 88 L142 110 Q136 150 128 182 Q140 210 138 238 L100 264 L62 238 Q60 210 72 182 Q64 150 58 110 Z" />
      <rect x="91" y="60" width="18" height="22" rx="6" />
      <ellipse cx="100" cy="38" rx="21" ry="26" />
      {back ? <path d="M100 96 L100 176" stroke="#D9C9EE" fill="none" /> : <circle cx="100" cy="172" r="1.6" fill="#C9B6E6" stroke="none" />}
    </g>
  )
}

export function BodyMap({ view = 'front', selected = [], onToggle, readOnly, size = 220 }) {
  const zones = view === 'front' ? FRONT : BACK
  return (
    <svg viewBox="0 0 200 400" width={size} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} role="img" aria-label={view === 'front' ? 'Vista frontal' : 'Vista posterior'}>
      <Silhouette back={view === 'back'} />
      {zones.map((z, i) => {
        const on = selected.includes(z.id)
        return (
          <ellipse key={z.id + i} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
            className={'zone' + (on ? ' on' : '') + (readOnly ? ' ro' : '')}
            onClick={readOnly ? undefined : () => onToggle && onToggle(z.id)} />
        )
      })}
      <text x="40" y="396" fontSize="10" fill="#9a93a8" textAnchor="middle">{view === 'front' ? 'Derecha' : 'Izquierda'}</text>
      <text x="160" y="396" fontSize="10" fill="#9a93a8" textAnchor="middle">{view === 'front' ? 'Izquierda' : 'Derecha'}</text>
    </svg>
  )
}

const q = (cx, cy, r, a1, a2) => {
  const rad = a => (a * Math.PI) / 180
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1))
  const x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2))
  return `M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`
}

export function BreastMap({ selected = [], onToggle, readOnly, size = 260 }) {
  // Mama derecha de la paciente a la izquierda del dibujo
  const L = { cx: 62, cy: 70 }, R = { cx: 178, cy: 70 }, r = 42
  const parts = [
    { id: 'der-se', d: q(L.cx, L.cy, r, 180, 270) }, { id: 'der-si', d: q(L.cx, L.cy, r, 270, 360) },
    { id: 'der-ii', d: q(L.cx, L.cy, r, 0, 90) }, { id: 'der-ie', d: q(L.cx, L.cy, r, 90, 180) },
    { id: 'izq-si', d: q(R.cx, R.cy, r, 180, 270) }, { id: 'izq-se', d: q(R.cx, R.cy, r, 270, 360) },
    { id: 'izq-ie', d: q(R.cx, R.cy, r, 0, 90) }, { id: 'izq-ii', d: q(R.cx, R.cy, r, 90, 180) },
  ]
  const cls = id => 'zone q' + (selected.includes(id) ? ' on' : '') + (readOnly ? ' ro' : '')
  const click = id => (readOnly ? undefined : () => onToggle && onToggle(id))
  return (
    <svg viewBox="0 0 240 140" width={size} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} role="img" aria-label="Mapa de mama">
      <ellipse cx="10" cy="40" rx="9" ry="16" className={cls('axila')} onClick={click('axila')} />
      <ellipse cx="230" cy="40" rx="9" ry="16" className={cls('axila')} onClick={click('axila')} />
      {parts.map(p => <path key={p.id} d={p.d} className={cls(p.id)} onClick={click(p.id)} />)}
      <circle cx={L.cx} cy={L.cy} r="9" className={cls('areola')} onClick={click('areola')} />
      <circle cx={R.cx} cy={R.cy} r="9" className={cls('areola')} onClick={click('areola')} />
      <text x={L.cx} y="132" fontSize="10" fill="#9a93a8" textAnchor="middle">Mama derecha</text>
      <text x={R.cx} y="132" fontSize="10" fill="#9a93a8" textAnchor="middle">Mama izquierda</text>
    </svg>
  )
}
