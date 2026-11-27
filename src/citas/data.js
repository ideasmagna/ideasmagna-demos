// Datos 100% ficticios para la demostración.
export const TODAY = '2026-11-11'
export const TODAY_LABEL = 'Martes 11 de noviembre'

export const CLINIC = {
  doctor: 'Dra. Sofía Morales',
  place: 'Torre Médica NovaSalud, Consultorio 408',
  address: 'Av. Principal 1055, Centro Empresarial',
}

export const DAYS = [
  { key: '2026-11-10', label: 'Lun 10' },
  { key: '2026-11-11', label: 'Mar 11' },
  { key: '2026-11-12', label: 'Mié 12' },
  { key: '2026-11-13', label: 'Jue 13' },
  { key: '2026-11-14', label: 'Vie 14' },
  { key: '2026-11-15', label: 'Sáb 15' },
]

export const TYPES = {
  'Primera vez': { min: 45, color: '#6B46C1' },
  'Control prenatal': { min: 30, color: '#10B981' },
  'Revisión mamaria': { min: 30, color: '#F472B6' },
  'Colposcopía': { min: 45, color: '#0EA5E9' },
  'Climaterio': { min: 30, color: '#F59E0B' },
  'Seguimiento': { min: 30, color: '#8B5CF6' },
  'Ultrasonido': { min: 30, color: '#14B8A6' },
}

export const APPOINTMENTS = [
  { id: 'a1', date: '2026-11-10', time: '09:00', patient: 'Mariana López', type: 'Control prenatal', status: 'atendida' },
  { id: 'a2', date: '2026-11-10', time: '10:00', patient: 'Sofía Herrera', type: 'Colposcopía', status: 'atendida' },
  { id: 'a3', date: '2026-11-10', time: '12:00', patient: 'Daniela Cruz', type: 'Primera vez', status: 'atendida', pre: 'NS-1036' },
  { id: 'a4', date: '2026-11-10', time: '16:00', patient: 'Gabriela Ortiz', type: 'Climaterio', status: 'no-asistio' },
  { id: 'a5', date: '2026-11-10', time: '17:00', patient: 'Valeria Ramos', type: 'Ultrasonido', status: 'atendida' },
  { id: 'b1', date: '2026-11-11', time: '09:00', patient: 'Mariana López', type: 'Control prenatal', status: 'confirmada' },
  { id: 'b2', date: '2026-11-11', time: '10:00', patient: 'Ana Rodríguez', type: 'Primera vez', status: 'confirmada', pre: 'NS-1042' },
  { id: 'b3', date: '2026-11-11', time: '11:30', patient: 'Carolina Pérez', type: 'Colposcopía', status: 'por-confirmar' },
  { id: 'b4', date: '2026-11-11', time: '13:00', patient: 'Lucía Gómez', type: 'Climaterio', status: 'confirmada' },
  { id: 'b5', date: '2026-11-11', time: '16:00', patient: 'Renata Díaz', type: 'Seguimiento', status: 'reagendada' },
  { id: 'b6', date: '2026-11-11', time: '17:00', patient: 'Fernanda Castillo', type: 'Revisión mamaria', status: 'confirmada' },
  { id: 'b7', date: '2026-11-11', time: '18:00', patient: 'Paula Medina', type: 'Primera vez', status: 'por-confirmar', pre: 'NS-1040' },
  { id: 'b8', date: '2026-11-11', time: '19:00', patient: 'Andrea Flores', type: 'Ultrasonido', status: 'confirmada' },
  { id: 'c1', date: '2026-11-12', time: '09:30', patient: 'Ximena Vargas', type: 'Control prenatal', status: 'confirmada' },
  { id: 'c2', date: '2026-11-12', time: '11:00', patient: 'Regina Morales', type: 'Revisión mamaria', status: 'confirmada' },
  { id: 'c3', date: '2026-11-12', time: '13:00', patient: 'Isabel Navarro', type: 'Primera vez', status: 'por-confirmar', pre: 'NS-1041' },
  { id: 'c4', date: '2026-11-12', time: '17:00', patient: 'Camila Rojas', type: 'Seguimiento', status: 'confirmada' },
  { id: 'd1', date: '2026-11-13', time: '10:00', patient: 'Natalia Silva', type: 'Climaterio', status: 'confirmada' },
  { id: 'd2', date: '2026-11-13', time: '12:00', patient: 'Elena Guerrero', type: 'Colposcopía', status: 'confirmada' },
  { id: 'd3', date: '2026-11-13', time: '16:30', patient: 'Mónica Reyes', type: 'Ultrasonido', status: 'por-confirmar' },
  { id: 'e1', date: '2026-11-14', time: '09:00', patient: 'Teresa Mendoza', type: 'Control prenatal', status: 'confirmada' },
  { id: 'e2', date: '2026-11-14', time: '11:00', patient: 'Julia Aguilar', type: 'Revisión mamaria', status: 'por-confirmar' },
  { id: 'e3', date: '2026-11-14', time: '13:00', patient: 'Diana Romero', type: 'Seguimiento', status: 'confirmada' },
  { id: 'f1', date: '2026-11-15', time: '10:00', patient: 'Laura García', type: 'Colposcopía', status: 'confirmada' },
]

export const BLOCKS = [
  { date: '2026-11-13', from: '08:00', to: '10:00', label: 'Cirugía programada' },
  { date: '2026-11-14', from: '15:00', to: '20:00', label: 'Congreso de ginecología' },
]

export const FREE_SLOTS = [
  { date: '2026-11-11', label: 'Mar 11 nov · 19:30' },
  { date: '2026-11-12', label: 'Mié 12 nov · 16:00' },
  { date: '2026-11-13', label: 'Jue 13 nov · 13:30' },
  { date: '2026-11-14', label: 'Vie 14 nov · 10:00' },
  { date: '2026-11-17', label: 'Lun 17 nov · 12:00' },
]

export const STAGES = [
  { key: 'nuevo', label: 'Nuevo contacto', hint: 'Escribió, aún sin preevaluación ni cita' },
  { key: 'preeval', label: 'Preevaluación', hint: 'Llenó su cuestionario' },
  { key: 'agendada', label: 'Cita agendada', hint: 'Eligió horario' },
  { key: 'confirmada', label: 'Confirmada', hint: 'Confirmó con el recordatorio' },
  { key: 'sin-respuesta', label: 'Sin respuesta', hint: 'No respondió en 3 días' },
]

export const PROSPECTS = [
  { id: 'p1', name: 'Karla Jiménez', phone: '55 1234 8890', source: 'WhatsApp', stage: 'nuevo', motive: 'Anticoncepción', when: 'Hace 20 min', last: '¿Cuánto cuesta colocar un DIU?', followup: 'Mensaje de seguimiento programado mañana 10:00' },
  { id: 'p2', name: 'Alejandra Soto', phone: '55 4410 2231', source: 'Instagram', stage: 'nuevo', motive: 'Revisión preventiva', when: 'Hace 2 h', last: 'Quiero hacerme el Papanicolaou', followup: 'Invitada a su preevaluación' },
  { id: 'p3', name: 'Brenda Luna', phone: '55 7781 0092', source: 'Web', stage: 'nuevo', motive: 'Menopausia', when: 'Ayer', last: 'Tengo bochornos muy fuertes', followup: 'Segundo recordatorio en 2 días' },
  { id: 'p4', name: 'Isabel Navarro', phone: '55 3390 1187', source: 'WhatsApp', stage: 'agendada', motive: 'Sangrado irregular', when: 'Ayer', last: 'Agendó mié 12 · 13:00', pre: 'NS-1041', priority: 'normal' },
  { id: 'p5', name: 'Ana Rodríguez', phone: '55 2201 7764', source: 'WhatsApp', stage: 'confirmada', motive: 'Dolor pélvico', when: 'Hace 3 días', last: 'Confirmó su cita de hoy 10:00', pre: 'NS-1042', priority: 'alta' },
  { id: 'p6', name: 'Paula Medina', phone: '55 6612 4407', source: 'Web', stage: 'agendada', motive: 'Mama', when: 'Hace 2 días', last: 'Agendó hoy 18:00', pre: 'NS-1040', priority: 'alta' },
  { id: 'p7', name: 'Rocío Estrada', phone: '55 9087 3321', source: 'Instagram', stage: 'preeval', motive: 'Deseo de embarazo', when: 'Hace 5 h', last: 'Terminó su preevaluación', pre: 'NS-1043', priority: 'normal', followup: 'Botón para agendar enviado' },
  { id: 'p8', name: 'Verónica Pineda', phone: '55 1176 5543', source: 'WhatsApp', stage: 'preeval', motive: 'Dolor menstrual', when: 'Ayer', last: 'Terminó su preevaluación', pre: 'NS-1039', priority: 'normal', followup: 'Recordatorio de 24 h enviado' },
  { id: 'p9', name: 'Mariela Campos', phone: '55 8823 6610', source: 'Web', stage: 'sin-respuesta', motive: 'Revisión preventiva', when: 'Hace 6 días', last: 'No respondió a 2 mensajes' },
  { id: 'p10', name: 'Sandra Fuentes', phone: '55 4456 2219', source: 'WhatsApp', stage: 'sin-respuesta', motive: 'Anticoncepción', when: 'Hace 8 días', last: 'No respondió a 2 mensajes' },
  { id: 'p11', name: 'Lorena Vega', phone: '55 3341 9902', source: 'Instagram', stage: 'confirmada', motive: 'Revisión mamaria', when: 'Hace 4 días', last: 'Confirmó vie 14 · 11:00' },
]

export const PREEVALS = [
  {
    folio: 'NS-1042', name: 'Ana Rodríguez', age: 34, date: 'Sáb 8 nov · 22:14', priority: 'alta', booked: 'Hoy · 10:00', reviewed: false,
    motive: ['Dolor pélvico', 'Sangrado abundante'], zones: ['bajo-vientre', 'fosa-der', 'lumbar'], intensity: 7,
    symptoms: ['Dolor durante la regla', 'Dolor en relaciones', 'Hinchazón abdominal'],
    profile: { embarazo: 'No', regla: '28 oct 2026', ciclos: 'Regulares, 5 a 7 días, abundantes', metodo: 'Ninguno', enfermedades: 'Ninguna', alergias: 'Penicilina' },
    history: { embarazos: '0', cirugias: 'Ninguna', papanicolaou: 'Hace 2 años', familia: 'Madre con miomas' },
    worries: ['El dolor que siento', 'No poder embarazarme'], note: 'El dolor me obliga a faltar al trabajo 1 o 2 días cada mes.',
    studies: ['Ultrasonido pélvico (mar 2026).pdf'],
    summary: 'Mujer de 34 años con dolor pélvico de 7/10 en bajo vientre, fosa iliaca derecha y región lumbar, relacionado con la menstruación y con dispareunia. Sangrado menstrual abundante. Sin embarazos; le preocupa su fertilidad. Alergia a penicilina. Trae ultrasonido de marzo 2026.',
  },
  {
    folio: 'NS-1040', name: 'Paula Medina', age: 46, date: 'Dom 9 nov · 11:02', priority: 'alta', booked: 'Hoy · 18:00', reviewed: false,
    motive: ['Mama'], zones: [], breast: ['izq-se'], intensity: 3,
    symptoms: ['Bolita que noto al tocarme'],
    profile: { embarazo: 'No', regla: '20 oct 2026', ciclos: 'Irregulares desde hace 1 año', metodo: 'Ninguno', enfermedades: 'Hipotiroidismo', alergias: 'Ninguna' },
    history: { embarazos: '2', cirugias: 'Cesárea (2012)', papanicolaou: 'Hace 1 año', familia: 'Tía materna con cáncer de mama' },
    worries: ['Que sea algo grave'], note: 'La noté hace dos semanas al bañarme.',
    studies: [],
    summary: 'Mujer de 46 años que refiere bolita nueva en el cuadrante superior externo de la mama izquierda, notada hace 2 semanas, dolor 3/10. Antecedente familiar de cáncer de mama (tía materna). Última mastografía no reportada. Hipotiroidismo.',
  },
  {
    folio: 'NS-1043', name: 'Rocío Estrada', age: 31, date: 'Hoy · 07:40', priority: 'normal', booked: null, reviewed: false,
    motive: ['Embarazo o deseo de embarazo'], zones: [], intensity: 0, symptoms: [],
    profile: { embarazo: 'No', regla: '2 nov 2026', ciclos: 'Regulares', metodo: 'Dejó pastillas hace 3 meses', enfermedades: 'Ninguna', alergias: 'Ninguna' },
    history: { embarazos: '0', cirugias: 'Ninguna', papanicolaou: 'Hace 3 años', familia: 'Ninguno' },
    worries: ['No tener un diagnóstico claro'], note: 'Queremos buscar embarazo este año.',
    studies: [],
    summary: 'Mujer de 31 años que desea embarazo; suspendió anticonceptivos orales hace 3 meses. Ciclos regulares, sin dolor. Papanicolaou hace 3 años. Busca valoración preconcepcional.',
  },
  {
    folio: 'NS-1041', name: 'Isabel Navarro', age: 39, date: 'Lun 10 nov · 20:31', priority: 'normal', booked: 'Mié 12 · 13:00', reviewed: true,
    motive: ['Sangrado irregular'], zones: ['bajo-vientre'], intensity: 3, symptoms: ['Sangrado entre reglas'],
    profile: { embarazo: 'No', regla: '25 oct 2026', ciclos: 'Sangrado entre reglas desde hace 4 meses', metodo: 'DIU de cobre', enfermedades: 'Ninguna', alergias: 'Ninguna' },
    history: { embarazos: '1', cirugias: 'Ninguna', papanicolaou: 'Hace 1 año', familia: 'Ninguno' },
    worries: ['Que sea algo grave'], note: '',
    studies: ['Biometría hemática (oct 2026).pdf'],
    summary: 'Mujer de 39 años con DIU de cobre que refiere sangrado intermenstrual desde hace 4 meses y molestia leve en bajo vientre (3/10). Trae biometría hemática de octubre.',
  },
  {
    folio: 'NS-1039', name: 'Verónica Pineda', age: 24, date: 'Lun 10 nov · 09:12', priority: 'normal', booked: null, reviewed: true,
    motive: ['Dolor pélvico'], zones: ['bajo-vientre'], intensity: 5, symptoms: ['Dolor durante la regla'],
    profile: { embarazo: 'No', regla: '30 oct 2026', ciclos: 'Regulares', metodo: 'Condón', enfermedades: 'Ninguna', alergias: 'Ninguna' },
    history: { embarazos: '0', cirugias: 'Ninguna', papanicolaou: 'Nunca', familia: 'Ninguno' },
    worries: ['Cómo afecta mi vida diaria'], note: '',
    studies: [],
    summary: 'Mujer de 24 años con dolor menstrual 5/10 en bajo vientre. Nunca se ha realizado Papanicolaou.',
  },
]

export const PATIENTS = [
  { id: 'x1', name: 'Mariana López', age: 29, phone: '55 2210 4471', motive: 'Embarazo', last: '28 oct 2026', next: 'Hoy · 09:00', visits: 7, tag: 'Embarazo 24 semanas' },
  { id: 'x2', name: 'Ana Rodríguez', age: 34, phone: '55 2201 7764', motive: 'Dolor pélvico', last: '—', next: 'Hoy · 10:00', visits: 0, tag: 'Primera vez', pre: 'NS-1042' },
  { id: 'x3', name: 'Carolina Pérez', age: 41, phone: '55 9930 1120', motive: 'Colposcopía', last: '12 ago 2026', next: 'Hoy · 11:30', visits: 3, tag: 'Papanicolaou alterado' },
  { id: 'x4', name: 'Lucía Gómez', age: 52, phone: '55 7712 9905', motive: 'Menopausia', last: '15 jul 2026', next: 'Hoy · 13:00', visits: 5, tag: 'Terapia hormonal' },
  { id: 'x5', name: 'Renata Díaz', age: 36, phone: '55 6634 2290', motive: 'Seguimiento', last: '20 oct 2026', next: 'Hoy · 16:00', visits: 2, tag: 'Postquirúrgico' },
  { id: 'x6', name: 'Fernanda Castillo', age: 44, phone: '55 1108 7743', motive: 'Mama', last: '5 nov 2025', next: 'Hoy · 17:00', visits: 4, tag: 'Revisión anual' },
  { id: 'x7', name: 'Sofía Herrera', age: 33, phone: '55 4471 3389', motive: 'Colposcopía', last: '10 nov 2026', next: '—', visits: 2, tag: 'Resultado pendiente' },
  { id: 'x8', name: 'Gabriela Ortiz', age: 50, phone: '55 8890 4412', motive: 'Menopausia', last: '3 jun 2026', next: '—', visits: 3, tag: 'No asistió 10 nov' },
  { id: 'x9', name: 'Laura García', age: 38, phone: '55 3367 2201', motive: 'Colposcopía', last: '1 sep 2026', next: 'Sáb 15 · 10:00', visits: 3, tag: 'Control' },
  { id: 'x10', name: 'Ximena Vargas', age: 27, phone: '55 9021 5567', motive: 'Embarazo', last: '29 oct 2026', next: 'Mié 12 · 09:30', visits: 5, tag: 'Embarazo 18 semanas' },
  { id: 'x11', name: 'Regina Morales', age: 47, phone: '55 2234 8876', motive: 'Mama', last: '11 nov 2025', next: 'Mié 12 · 11:00', visits: 2, tag: 'Mastografía anual' },
  { id: 'x12', name: 'Natalia Silva', age: 55, phone: '55 6678 1123', motive: 'Menopausia', last: '20 ago 2026', next: 'Jue 13 · 10:00', visits: 6, tag: 'Osteoporosis' },
  { id: 'x13', name: 'Teresa Mendoza', age: 31, phone: '55 5543 2219', motive: 'Embarazo', last: '31 oct 2026', next: 'Vie 14 · 09:00', visits: 4, tag: 'Embarazo 30 semanas' },
  { id: 'x14', name: 'Diana Romero', age: 42, phone: '55 1190 6654', motive: 'Seguimiento', last: '16 oct 2026', next: 'Vie 14 · 13:00', visits: 3, tag: 'Laparoscopía' },
  { id: 'x15', name: 'Valeria Ramos', age: 30, phone: '55 7745 3310', motive: 'Ultrasonido', last: '10 nov 2026', next: '—', visits: 1, tag: 'Quiste ovárico' },
  { id: 'x16', name: 'Daniela Cruz', age: 26, phone: '55 8812 0034', motive: 'Anticoncepción', last: '10 nov 2026', next: '—', visits: 1, tag: 'Plan enviado', pre: 'NS-1036' },
]

export const HISTORY = {
  default: [
    { date: '28 oct 2026', type: 'Control prenatal', note: 'Evolución normal. Plan enviado por WhatsApp.' },
    { date: '30 sep 2026', type: 'Ultrasonido', note: 'Estudio morfológico.' },
    { date: '2 sep 2026', type: 'Control prenatal', note: 'Laboratorios solicitados.' },
  ],
}

export const THREADS = [
  {
    id: 't1', name: 'Laura García', phone: '55 3367 2201', when: '08:12', unread: true, kind: 'Pregunta médica',
    summary: 'Paciente con colposcopía el sábado 15 pregunta si puede tomar ibuprofeno antes del estudio por cólico menstrual.',
    messages: [
      { from: 'p', text: 'Buenos días, tengo mi colposcopía el sábado', time: '08:10' },
      { from: 'a', text: '¡Buenos días, Laura! Sí, tu cita es el sábado 15 de noviembre a las 10:00. ¿En qué te puedo ayudar?', time: '08:10' },
      { from: 'p', text: 'Tengo cólico, ¿puedo tomar ibuprofeno antes del estudio?', time: '08:11' },
      { from: 'a', text: 'Esa es una pregunta médica y prefiero que la responda la doctora. Ya se la pasé y te contestará por aquí en cuanto pueda.', time: '08:12' },
    ],
  },
  {
    id: 't2', name: 'Jimena Torres', phone: '55 4402 8817', when: 'Ayer', unread: true, kind: 'Caso especial',
    summary: 'Prospecta pregunta si la doctora acepta su seguro de gastos médicos mayores (GNP) y si puede facturar a la aseguradora.',
    messages: [
      { from: 'p', text: '¿Aceptan seguro de gastos médicos? Tengo GNP', time: '19:40' },
      { from: 'a', text: 'Gracias por escribir, Jimena. La doctora te confirma los detalles de tu seguro personalmente. Ya le pasé tu pregunta.', time: '19:41' },
    ],
  },
  {
    id: 't3', name: 'Carolina Pérez', phone: '55 9930 1120', when: 'Lun', unread: false, kind: 'Pregunta médica',
    summary: 'Pregunta si debe suspender relaciones antes de la colposcopía. Respondida por la doctora.',
    messages: [
      { from: 'p', text: '¿Debo evitar relaciones antes de la colposcopía?', time: '13:02' },
      { from: 'a', text: 'Le pasé tu pregunta a la doctora.', time: '13:02' },
      { from: 'd', text: 'Hola Carolina, sí: evita relaciones, óvulos y duchas vaginales 48 horas antes. Nos vemos el martes.', time: '15:30' },
    ],
  },
]

export const PLANS = [
  { id: 'pl1', name: 'Daniela Cruz', date: '10 nov 2026', title: 'Inicio de anticonceptivo oral', control: 'Control en 3 meses', status: 'Leído' },
  { id: 'pl2', name: 'Sofía Herrera', date: '10 nov 2026', title: 'Indicaciones post colposcopía', control: 'Resultados en 10 días', status: 'Entregado' },
  { id: 'pl3', name: 'Mariana López', date: '28 oct 2026', title: 'Control prenatal semana 22', control: 'Control en 2 semanas (hoy)', status: 'Leído' },
  { id: 'pl4', name: 'Renata Díaz', date: '20 oct 2026', title: 'Cuidados postquirúrgicos', control: 'Control en 3 semanas', status: 'Leído' },
]

export const CONTROLS = [
  { name: 'Gabriela Ortiz', reason: 'No asistió a su cita del 10 nov', due: 'Vencido', action: 'Reagendar' },
  { name: 'Valeria Ramos', reason: 'Ultrasonido de control del quiste', due: 'En 6 semanas', action: 'Programado' },
  { name: 'Fernanda Castillo', reason: 'Mastografía anual', due: 'Vencido', action: 'Recordar' },
  { name: 'Patricia León', reason: 'Papanicolaou anual', due: 'Vencido', action: 'Recordar' },
  { name: 'Sofía Herrera', reason: 'Resultado de biopsia', due: 'En 10 días', action: 'Programado' },
]

export const REMINDERS = [
  { when: 'Hoy 19:00', what: 'Recordatorio 24 h · 6 citas de mañana', kind: 'Recordatorio' },
  { when: 'Mañana 10:00', what: 'Seguimiento a Karla Jiménez (sin cita)', kind: 'Prospecto' },
  { when: 'Jue 13 10:00', what: 'Segundo seguimiento a Brenda Luna', kind: 'Prospecto' },
  { when: 'Vie 14 09:00', what: 'Recordatorio de control a Fernanda Castillo', kind: 'Control' },
]

export const STATS = {
  months: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
  attended: [52, 58, 55, 63, 66, 71],
  newProspects: [18, 22, 20, 27, 31, 38],
  converted: [9, 12, 11, 16, 19, 24],
  noShow: [8, 7, 7, 5, 4, 3],
  motives: [['Embarazo', 31], ['Revisión preventiva', 22], ['Mama', 17], ['Dolor pélvico', 12], ['Menopausia', 10], ['Anticoncepción', 8]],
  sources: [['WhatsApp directo', 46], ['Instagram', 28], ['Sitio web', 18], ['Recomendación', 8]],
}

export const KB = [
  { cat: 'Consultorio', items: [
    { q: '¿Dónde está el consultorio?', a: 'Torre Médica NovaSalud, Centro de Especialidades Quirúrgicas, Consultorio 974. Av. Principal 1055, Centro Empresarial.' },
    { q: '¿Cuál es el horario?', a: 'Lunes a viernes de 9:00 a 20:00 y sábados de 9:00 a 14:00, con cita previa.' },
    { q: '¿Hay estacionamiento?', a: 'Sí, el hospital cuenta con estacionamiento con costo por hora.' },
  ]},
  { cat: 'Precios y pagos', items: [
    { q: '¿Cuánto cuesta la consulta?', a: 'La consulta de primera vez cuesta $1,500 MXN e incluye ultrasonido de primer nivel. (Precio de ejemplo)' },
    { q: '¿Qué formas de pago aceptan?', a: 'Efectivo, tarjeta de débito o crédito y transferencia.' },
    { q: '¿Aceptan seguros?', a: 'La doctora confirma cada caso de forma personal.' },
  ]},
  { cat: 'Preparación para estudios', items: [
    { q: '¿Cómo me preparo para la colposcopía?', a: 'Evita relaciones, óvulos y duchas vaginales 48 horas antes. No debe coincidir con tu menstruación.' },
    { q: '¿Necesito ir en ayunas al ultrasonido?', a: 'No es necesario. Para el ultrasonido pélvico se recomienda llegar con la vejiga llena.' },
  ]},
]

export const HOURS = [
  { day: 'Lunes', on: true, from: '09:00', to: '20:00' },
  { day: 'Martes', on: true, from: '09:00', to: '20:00' },
  { day: 'Miércoles', on: true, from: '09:00', to: '20:00' },
  { day: 'Jueves', on: true, from: '09:00', to: '20:00' },
  { day: 'Viernes', on: true, from: '09:00', to: '20:00' },
  { day: 'Sábado', on: true, from: '09:00', to: '14:00' },
  { day: 'Domingo', on: false, from: '—', to: '—' },
]

export const ZONES_LABEL = {
  'abdomen-alto': 'Abdomen alto', 'ombligo': 'Alrededor del ombligo', 'bajo-vientre': 'Bajo vientre',
  'fosa-der': 'Fosa iliaca derecha', 'fosa-izq': 'Fosa iliaca izquierda', 'genital': 'Zona genital',
  'ingle-der': 'Ingle derecha', 'ingle-izq': 'Ingle izquierda', 'muslo-der': 'Muslo derecho', 'muslo-izq': 'Muslo izquierdo',
  'lumbar': 'Espalda baja', 'sacro': 'Sacro', 'muslo-post': 'Cara posterior de muslos',
  'mama-der': 'Mama derecha', 'mama-izq': 'Mama izquierda', 'flanco-der': 'Flanco derecho', 'flanco-izq': 'Flanco izquierdo',
  'gluteo-der': 'Glúteo derecho', 'gluteo-izq': 'Glúteo izquierdo',
}
export const BREAST_LABEL = {
  'der-se': 'Mama derecha · superior externo', 'der-si': 'Mama derecha · superior interno', 'der-ie': 'Mama derecha · inferior externo', 'der-ii': 'Mama derecha · inferior interno',
  'izq-se': 'Mama izquierda · superior externo', 'izq-si': 'Mama izquierda · superior interno', 'izq-ie': 'Mama izquierda · inferior externo', 'izq-ii': 'Mama izquierda · inferior interno',
  'areola': 'Areola o pezón', 'axila': 'Axila',
}
