const KEY = 'demo-novasalud-citas-v1'

export function loadSubs() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
export function saveSubs(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* sin almacenamiento */ }
}
export function addSub(sub) {
  const list = loadSubs().filter(s => s.folio !== sub.folio)
  list.unshift(sub); saveSubs(list); return list
}
export function updateSub(folio, patch) {
  const list = loadSubs().map(s => (s.folio === folio ? { ...s, ...patch } : s))
  saveSubs(list); return list
}
export function resetDemo() {
  try { localStorage.removeItem(KEY) } catch { /* nada */ }
}
export function nextFolio() {
  return 'NS-' + (1044 + loadSubs().length)
}
export function nowLabel() {
  const d = new Date()
  return 'Hoy · ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}
