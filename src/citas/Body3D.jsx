import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ZONES_LABEL } from './data.js'

// Modelo base: MakeHuman (activos CC0 1.0). Zonas calculadas sobre la forma en reposo,
// así las "máscaras" siguen al cuerpo cuando cambia la complexión.
export const ZONE_IDS = ['', 'mama-der', 'mama-izq', 'abdomen-alto', 'ombligo', 'flanco-der', 'flanco-izq', 'bajo-vientre',
  'fosa-der', 'fosa-izq', 'genital', 'ingle-der', 'ingle-izq', 'muslo-der', 'muslo-izq', 'lumbar', 'sacro', 'gluteo-der', 'gluteo-izq', 'muslo-post']
const BACK_ZONES = ['lumbar', 'sacro', 'gluteo-der', 'gluteo-izq', 'muslo-post']
export const isBackZone = z => BACK_ZONES.includes(z)

// Misma lógica en JS (para tocar) y en GLSL (para pintar). x<0 = lado derecho de la paciente.
function zoneOf(x, y, z, nz, part) {
  const ax = Math.abs(x), s = x < 0 ? 0 : 1
  const torso = part > 0.5 && part < 1.5, thigh = part > 1.5, pel = part > 0.5
  const front = nz > 0.05, back = nz < -0.05
  if (torso && front && ((ax - 1.0) / 0.95) ** 2 + ((y - 3.35) / 0.78) ** 2 < 1) return 1 + s
  if (front && torso && y > 1.95 && y < 2.75 && ax < 1.25) return 3
  if (front && torso && y > 1.1 && y <= 1.95 && ax < 0.7) return 4
  if (front && torso && y > 1.1 && y <= 1.95 && ax < 1.6) return 5 + s
  if (front && pel && y > 0.2 && y <= 1.1 && ax < 0.6) return 7
  if (front && pel && y > 0.2 && y <= 1.1 && ax < 1.75) return 8 + s
  if (pel && y <= 0.2 && y > -2.1 && ax < 0.5 && z > 0.15) return 10
  if (front && pel && y <= 0.2 && y > -1.15 && ax < 1.85) return 11 + s
  if (front && thigh && y <= -1.15 && y > -3.5) return 13 + s
  if (back && torso && y > 0.55 && y < 2.4 && ax < 1.5) return 15
  if (back && pel && y > -0.45 && y <= 0.55 && ax < 0.55) return 16
  if (back && pel && y > -1.75 && y <= 0.55 && ax < 1.85) return 17 + s
  if (back && thigh && y <= -1.75 && y > -3.5) return 19
  return 0
}
const GLSL_ZONE = `
float zoneOf(vec3 p, float nz, float part){
  float x=p.x, y=p.y, z=p.z, ax=abs(x); float s = x<0.0 ? 0.0 : 1.0;
  bool torso = part>0.5 && part<1.5; bool thigh = part>1.5; bool pel = part>0.5;
  bool front = nz>0.05; bool back = nz< -0.05;
  if (torso && front && pow((ax-1.0)/0.95,2.0)+pow((y-3.35)/0.78,2.0) < 1.0) return 1.0+s;
  if (front && torso && y>1.95 && y<2.75 && ax<1.25) return 3.0;
  if (front && torso && y>1.1 && y<=1.95 && ax<0.7) return 4.0;
  if (front && torso && y>1.1 && y<=1.95 && ax<1.6) return 5.0+s;
  if (front && pel && y>0.2 && y<=1.1 && ax<0.6) return 7.0;
  if (front && pel && y>0.2 && y<=1.1 && ax<1.75) return 8.0+s;
  if (pel && y<=0.2 && y>-2.1 && ax<0.5 && z>0.15) return 10.0;
  if (front && pel && y<=0.2 && y>-1.15 && ax<1.85) return 11.0+s;
  if (front && thigh && y<=-1.15 && y>-3.5) return 13.0+s;
  if (back && torso && y>0.55 && y<2.4 && ax<1.5) return 15.0;
  if (back && pel && y>-0.45 && y<=0.55 && ax<0.55) return 16.0;
  if (back && pel && y>-1.75 && y<=0.55 && ax<1.85) return 17.0+s;
  if (back && thigh && y<=-1.75 && y>-3.5) return 19.0;
  return 0.0;
}`

let dataPromise
function loadData() {
  if (!dataPromise) {
    const base = import.meta.env.BASE_URL
    dataPromise = Promise.all([
      fetch(base + '/body3d.json').then(r => r.json()),
      fetch(base + '/body3d.bin').then(r => r.arrayBuffer()),
    ])
  }
  return dataPromise
}

export default function Body3D({ selected = [], onToggle, readOnly = false, height = 420, compact = false, initialView = 'front' }) {
  const wrap = useRef(null)
  const api = useRef({})
  const [mass, setMass] = useState(0.5)
  const [hover, setHover] = useState(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const sel = useRef(selected); sel.current = selected
  const toggle = useRef(onToggle); toggle.current = onToggle

  useEffect(() => {
    let disposed = false, raf
    const el = wrap.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (e) { setFailed(true); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableDamping = true
    controls.minPolarAngle = Math.PI * 0.32; controls.maxPolarAngle = Math.PI * 0.62
    controls.minDistance = 22; controls.maxDistance = 46
    controls.rotateSpeed = 0.7
    scene.add(new THREE.HemisphereLight(0xfff8f2, 0xd9cbe8, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(6, 10, 14); scene.add(key)
    const rim = new THREE.DirectionalLight(0xe9d5ff, 1.1); rim.position.set(-8, 6, -12); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(-10, -2, 8); scene.add(fill)
    const backKey = new THREE.DirectionalLight(0xffffff, 1.3); backKey.position.set(5, 9, -14); scene.add(backKey)

    const uniforms = { uSel: { value: new Array(20).fill(0) }, uHover: { value: 0 }, uShow: { value: 1 }, uRO: { value: readOnly ? 1 : 0 } }
    let mesh
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize); ro.observe(el)

    loadData().then(([meta, buf]) => {
      if (disposed) return
      const P = meta.parts
      const f32 = k => new Float32Array(buf, P[k][0], P[k][1])
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(f32('pos'), 3))
      g.setAttribute('normal', new THREE.BufferAttribute(f32('nor'), 3))
      g.setAttribute('part', new THREE.BufferAttribute(f32('part'), 1))
      g.setIndex(new THREE.BufferAttribute(new Uint16Array(buf, P.idx[0], P.idx[1]), 1))
      g.morphAttributes.position = [new THREE.BufferAttribute(f32('dmin'), 3), new THREE.BufferAttribute(f32('dmax'), 3)]
      g.morphAttributes.normal = [new THREE.BufferAttribute(f32('nmin'), 3), new THREE.BufferAttribute(f32('nmax'), 3)]
      g.morphTargetsRelative = true
      g.addGroup(0, meta.bodyIdx, 0); g.addGroup(meta.bodyIdx, meta.eyeIdx, 1)
      const skin = new THREE.MeshStandardMaterial({ color: 0xeedfd6, roughness: 0.62, metalness: 0 })
      skin.onBeforeCompile = sh => {
        Object.assign(sh.uniforms, uniforms)
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nattribute float part;\nvarying vec3 vRest; varying vec3 vRestN; varying float vPart;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRest = position; vRestN = normal; vPart = part;')
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vRest; varying vec3 vRestN; varying float vPart;\nuniform float uSel[20]; uniform float uHover; uniform float uShow; uniform float uRO;\n' + GLSL_ZONE)
          .replace('#include <color_fragment>', `#include <color_fragment>
            float zid = zoneOf(vRest, normalize(vRestN).z, vPart);
            if (uShow > 0.5) {
              int zi = int(zid + 0.5);
              float on = 0.0; for (int i = 0; i < 20; i++) { if (i == zi) on = uSel[i]; }
              if (zi > 0 && (uRO < 0.5 || on > 0.5)) {
                vec3 tint = vec3(0.80, 0.72, 0.95);
                diffuseColor.rgb = mix(diffuseColor.rgb, tint, 0.30);
                if (abs(zid - uHover) < 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.98, 0.66, 0.83), 0.55);
                if (on > 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.93, 0.29, 0.60), 0.82);
              }
              vec3 dx = dFdx(vRest) * 1.4, dy = dFdy(vRest) * 1.4;
              float nzz = normalize(vRestN).z;
              bool edge = zoneOf(vRest + dx, nzz, vPart) != zid || zoneOf(vRest - dx, nzz, vPart) != zid
                       || zoneOf(vRest + dy, nzz, vPart) != zid || zoneOf(vRest - dy, nzz, vPart) != zid;
              if (edge && zi > 0 && (uRO < 0.5 || on > 0.5)) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.52, 0.36, 0.80), 0.75);
            }`)
      }
      const eye = new THREE.MeshStandardMaterial({ color: 0x8d7f95, roughness: 0.35 })
      mesh = new THREE.Mesh(g, [skin, eye])
      mesh.morphTargetInfluences = [0, 0]
      mesh.position.y = -(meta.minY + meta.maxY) / 2
      scene.add(mesh)
      controls.target.set(0, 0, 0)
      const az = initialView === 'back' ? Math.PI : 0
      camera.position.set(Math.sin(az) * 31, 2, Math.cos(az) * 31)
      controls.update()
      setReady(true)
    }).catch(() => setFailed(true))

    // tocar zonas
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
    const pick = ev => {
      if (!mesh) return 0
      const r = renderer.domElement.getBoundingClientRect()
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObject(mesh, false)[0]
      if (!hit || hit.face.materialIndex !== 0 || !hit.barycoord) return 0
      const g = mesh.geometry, pos = g.attributes.position, nor = g.attributes.normal, part = g.attributes.part
      const { a, b, c } = hit.face, w = hit.barycoord
      const L = (attr, i) => attr.getX(a) * w.x + attr.getX(b) * w.y + attr.getX(c) * w.z
      const p = [0, 1, 2].map(k => {
        const get = (attr, i) => k === 0 ? attr.getX(i) : k === 1 ? attr.getY(i) : attr.getZ(i)
        return get(pos, a) * w.x + get(pos, b) * w.y + get(pos, c) * w.z
      })
      const nz = nor.getZ(a) * w.x + nor.getZ(b) * w.y + nor.getZ(c) * w.z
      return zoneOf(p[0], p[1], p[2], nz, L(part))
    }
    let down = null
    const onDown = e => { down = { x: e.clientX, y: e.clientY } }
    const onUp = e => {
      if (!down || readOnly) return
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null
      if (moved > 6) return
      const z = pick(e); if (z > 0 && toggle.current) toggle.current(ZONE_IDS[z])
    }
    const onMove = e => {
      if (readOnly || e.pointerType === 'touch') return
      const z = pick(e); uniforms.uHover.value = z || -1; setHover(z ? ZONE_IDS[z] : null)
      renderer.domElement.style.cursor = z ? 'pointer' : 'grab'
    }
    const onLeave = () => { uniforms.uHover.value = -1; setHover(null) }
    const cv = renderer.domElement
    cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerleave', onLeave)

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const s = sel.current
      for (let i = 0; i < 20; i++) uniforms.uSel.value[i] = s.includes(ZONE_IDS[i]) ? 1 : 0
      if (api.current.turnTo != null) {
        const t = api.current.turnTo, cur = controls.getAzimuthalAngle()
        let d = t - cur; d = Math.atan2(Math.sin(d), Math.cos(d))
        if (Math.abs(d) < 0.01) api.current.turnTo = null
        else {
          const off = camera.position.clone().sub(controls.target)
          off.applyAxisAngle(new THREE.Vector3(0, 1, 0), d * 0.14)
          camera.position.copy(controls.target).add(off)
        }
      }
      controls.update(); renderer.render(scene, camera)
    }
    loop()
    api.current.setMass = m => { if (mesh) mesh.morphTargetInfluences = [Math.max(0, (0.5 - m) * 2), Math.max(0, (m - 0.5) * 2)] }
    return () => {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); controls.dispose()
      if (mesh) { mesh.geometry.dispose(); mesh.material.forEach(m => m.dispose()) }
      renderer.dispose(); cv.remove()
    }
  }, [readOnly])

  useEffect(() => { api.current.setMass && api.current.setMass(mass) }, [mass, ready])

  const turn = side => { api.current.turnTo = side === 'back' ? Math.PI : 0 }

  if (failed) return <div className="b3d-fail">Su navegador no pudo mostrar el modelo 3D.</div>
  return (
    <div className={'b3d' + (compact ? ' compact' : '')}>
      <div className="b3d-stage" ref={wrap} style={{ height }}>
        {!ready && <div className="b3d-loading">Cargando modelo 3D…</div>}
        {hover && <div className="b3d-tip">{ZONES_LABEL[hover]}</div>}
        <div className="b3d-turn">
          <button onClick={() => turn('front')}>Frente</button>
          <button onClick={() => turn('back')}>Espalda</button>
        </div>
      </div>
      {!readOnly && (
        <div className="b3d-mass">
          <span>Delgada</span>
          <input type="range" min="0" max="1" step="0.01" value={mass} onChange={e => setMass(Number(e.target.value))} aria-label="Complexión" />
          <span>Robusta</span>
        </div>
      )}
      {!readOnly && <p className="b3d-hint">Gira el modelo con el dedo o el mouse, ajusta la complexión y toca las zonas donde sientes molestia.</p>}
    </div>
  )
}
