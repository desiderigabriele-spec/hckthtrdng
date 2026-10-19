import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Candle { o: number; c: number; h: number; l: number }

function makeChart(seed: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 300
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  let price = 100 + seed * 7
  const candles: Candle[] = []
  const next = () => {
    const o = price
    const c = o + (Math.random() - 0.47) * 3.2
    const h = Math.max(o, c) + Math.random() * 1.4
    const l = Math.min(o, c) - Math.random() * 1.4
    price = c
    candles.push({ o, c, h, l })
    if (candles.length > 46) candles.shift()
  }
  for (let i = 0; i < 46; i++) next()

  const draw = () => {
    ctx.fillStyle = '#020604'
    ctx.fillRect(0, 0, 512, 300)
    ctx.strokeStyle = 'rgba(0,255,65,0.08)'
    ctx.lineWidth = 1
    for (let y = 30; y < 300; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke() }
    for (let x = 0; x < 512; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 300); ctx.stroke() }

    const hi = Math.max(...candles.map((k) => k.h))
    const lo = Math.min(...candles.map((k) => k.l))
    const py = (v: number) => 30 + (1 - (v - lo) / (hi - lo || 1)) * 240
    const w = 512 / candles.length

    ctx.beginPath()
    candles.forEach((_, i) => {
      const x = i * w + w / 2
      const ma = candles.slice(Math.max(0, i - 8), i + 1).reduce((s, q) => s + q.c, 0) / Math.min(i + 1, 9)
      if (i === 0) ctx.moveTo(x, py(ma)); else ctx.lineTo(x, py(ma))
    })
    ctx.strokeStyle = 'rgba(255,184,0,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()

    candles.forEach((k, i) => {
      const x = i * w + w / 2
      const up = k.c >= k.o
      ctx.strokeStyle = ctx.fillStyle = up ? '#00FF41' : '#FF0033'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(x, py(k.h)); ctx.lineTo(x, py(k.l)); ctx.stroke()
      const top = py(Math.max(k.o, k.c))
      ctx.fillRect(x - w * 0.32, top, w * 0.64, Math.max(2, py(Math.min(k.o, k.c)) - top))
    })

    const last = candles[candles.length - 1]
    ctx.fillStyle = '#00FF41'
    ctx.font = 'bold 18px monospace'
    ctx.fillText(`XAU/USD  ${(2300 + last.c).toFixed(2)}`, 14, 22)
    texture.needsUpdate = true
  }
  draw()

  let partial = 0
  const tick = () => {
    const last = candles[candles.length - 1]
    partial++
    last.c += (Math.random() - 0.48) * 0.9
    last.h = Math.max(last.h, last.c)
    last.l = Math.min(last.l, last.c)
    if (partial > 6) { partial = 0; next() }
    draw()
  }
  return { texture, tick }
}

export default function TraderScene({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0d0d0d, 6, 16)
    const camera = new THREE.PerspectiveCamera(small ? 50 : 38, 1, 0.1, 60)

    // Materiali
    const suit = new THREE.MeshStandardMaterial({ color: 0x262d2b, roughness: 0.7, metalness: 0.08 })
    const skin = new THREE.MeshStandardMaterial({ color: 0x3a2a22, roughness: 0.6 })
    const hair = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })
    const shirt = new THREE.MeshStandardMaterial({ color: 0xd8dcd9, roughness: 0.5 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x0b0d0c, roughness: 0.4, metalness: 0.5 })

    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1], parent: THREE.Object3D = scene) => {
      const m = new THREE.Mesh(geo, mat)
      m.position.set(...pos)
      m.rotation.set(...rot)
      m.scale.set(...scale)
      parent.add(m)
      return m
    }

    // Scrivania e monitor
    add(new THREE.BoxGeometry(3.6, 0.06, 1.3), dark, [0, 0.76, -0.35])
    const charts = [0, 1, 2].map((i) => makeChart(i))
    const monitorPos: [number, number, number, number][] = [[-1.2, 1.32, -0.62, 0.42], [0, 1.36, -0.85, 0], [1.2, 1.32, -0.62, -0.42]]
    monitorPos.forEach(([x, y, z, ry], i) => {
      const g = new THREE.Group()
      g.position.set(x, y, z)
      g.rotation.y = ry
      scene.add(g)
      add(new THREE.BoxGeometry(1.16, 0.7, 0.04), dark, [0, 0, -0.025], [0, 0, 0], [1, 1, 1], g)
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.64), new THREE.MeshBasicMaterial({ map: charts[i].texture, toneMapped: false }))
      g.add(screen)
      add(new THREE.BoxGeometry(0.06, 0.5, 0.06), dark, [0, -0.55, -0.06], [0, 0, 0], [1, 1, 1], g)
      const light = new THREE.PointLight(0x00ff41, 2.2, 3.2, 1.6)
      light.position.set(0, 0, 0.35)
      g.add(light)
    })
    add(new THREE.BoxGeometry(0.62, 0.025, 0.2), dark, [0, 0.8, -0.05])

    // Trader seduto, visto di schiena
    const body = new THREE.Group()
    body.position.set(0, 0, 0.62)
    scene.add(body)

    const torso = add(new THREE.CylinderGeometry(0.26, 0.19, 0.52, 28), suit, [0, 1.14, 0], [0.1, 0, 0], [1, 1, 0.62], body)
    add(new THREE.CapsuleGeometry(0.1, 0.4, 8, 16), suit, [0, 1.38, 0.0], [0.08, 0, Math.PI / 2], [1, 1, 0.8], body)
    add(new THREE.CapsuleGeometry(0.14, 0.2, 8, 16), suit, [0, 0.86, -0.05], [0, 0, Math.PI / 2], [1, 1, 0.9], body)
    add(new THREE.CylinderGeometry(0.07, 0.1, 0.07, 20), shirt, [0, 1.48, -0.01], [0.15, 0, 0], [1, 1, 1], body)
    add(new THREE.TorusGeometry(0.095, 0.028, 10, 28), suit, [0, 1.46, -0.005], [Math.PI / 2 + 0.15, 0, 0], [1, 1, 1], body)
    add(new THREE.CylinderGeometry(0.05, 0.055, 0.1, 16), skin, [0, 1.54, -0.02], [0.15, 0, 0], [1, 1, 1], body)
    const head = new THREE.Group()
    head.position.set(0, 1.67, -0.04)
    body.add(head)
    add(new THREE.SphereGeometry(0.1, 32, 24), skin, [0, 0, 0], [0, 0, 0], [0.9, 1.15, 1], head)
    add(new THREE.SphereGeometry(0.105, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6), hair, [0, 0.014, 0.01], [-0.35, 0, 0], [0.92, 1.15, 1.02], head)
    add(new THREE.SphereGeometry(0.03, 12, 12), skin, [-0.092, -0.01, -0.01], [0, 0, 0], [0.5, 1, 0.8], head)
    add(new THREE.SphereGeometry(0.03, 12, 12), skin, [0.092, -0.01, -0.01], [0, 0, 0], [0.5, 1, 0.8], head)

    const arms = [-1, 1].map((side) => {
      const upper = add(new THREE.CapsuleGeometry(0.068, 0.3, 6, 12), suit, [side * 0.31, 1.2, -0.06], [0.5, 0, side * 0.12], [1, 1, 1], body)
      const fore = add(new THREE.CapsuleGeometry(0.055, 0.3, 6, 12), suit, [side * 0.26, 1.0, -0.33], [1.45, 0, -side * 0.2], [1, 1, 1], body)
      add(new THREE.SphereGeometry(0.045, 12, 12), skin, [side * 0.22, 0.86, -0.52], [0, 0, 0], [1, 0.6, 1.4], body)
      return { upper, fore }
    })

    // Sedia
    add(new THREE.BoxGeometry(0.5, 0.06, 0.45), dark, [0, 0.68, 0.6])
    add(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), dark, [0, 0.46, 0.6])

    // Skyline notturno oltre i monitor
    const cityCount = small ? 900 : 1800
    const cityPos = new Float32Array(cityCount * 3)
    for (let i = 0; i < cityCount; i++) {
      const bx = Math.floor(Math.random() * 40)
      const height = 1 + Math.abs(Math.sin(bx * 12.9898) * 4.5)
      cityPos[i * 3] = (bx - 20) * 0.45 + (Math.random() - 0.5) * 0.3
      cityPos[i * 3 + 1] = Math.random() * height
      cityPos[i * 3 + 2] = -7 - Math.random() * 2
    }
    const cityGeo = new THREE.BufferGeometry()
    cityGeo.setAttribute('position', new THREE.BufferAttribute(cityPos, 3))
    const city = new THREE.Points(cityGeo, new THREE.PointsMaterial({ color: 0x00ff41, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }))
    scene.add(city)

    // Luci: bagliore schermi + controluce che disegna la silhouette
    scene.add(new THREE.AmbientLight(0x1a2a20, 1.1))
    const rim = new THREE.DirectionalLight(0x9effb8, 2.6)
    rim.position.set(0.6, 2.4, -3)
    scene.add(rim)
    const rimL = new THREE.DirectionalLight(0x00ff41, 1.6)
    rimL.position.set(-2.5, 1.6, -1.5)
    scene.add(rimL)
    const fill = new THREE.DirectionalLight(0x9ab8a8, 0.9)
    fill.position.set(1.5, 3, 4)
    scene.add(fill)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      // Inquadratura: su desktop il trader va a destra del testo, su mobile in alto
      if (w >= 768) {
        camera.aspect = (w * 1.5) / h
        camera.setViewOffset(w * 1.5, h, 0, 0, w, h)
      } else {
        camera.aspect = w / (h * 1.6)
        camera.setViewOffset(w, h * 1.6, 0, h * 0.5, w, h)
      }
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(host)

    const target = new THREE.Vector3(0, 1.25, -0.5)
    const clock = new THREE.Clock()
    let lastTick = 0
    let raf = 0

    const render = () => {
      const t = clock.getElapsedTime()
      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04
      const scroll = Math.min(1, window.scrollY / window.innerHeight)

      const dist = (small ? 3.2 : 2.7) - scroll * 0.8
      camera.position.set(
        Math.sin(t * 0.08) * 0.3 + pointer.x * 0.4 + 0.25,
        1.9 + pointer.y * -0.15 + Math.sin(t * 0.21) * 0.03,
        0.62 + dist,
      )
      camera.lookAt(target)

      torso.scale.y = 1 + Math.sin(t * 1.4) * 0.012
      head.rotation.y = Math.sin(t * 0.35) * 0.45
      head.rotation.x = 0.08 + Math.sin(t * 0.5) * 0.03
      arms.forEach(({ fore }, i) => { fore.rotation.x = 1.45 + Math.sin(t * 9 + i * 1.7) * 0.02 })

      if (t - lastTick > 0.18) { lastTick = t; charts.forEach((c) => c.tick()) }
      renderer.render(scene, camera)
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (visible) render()
    }
    if (reduced) render(); else loop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          o.geometry.dispose()
          const mat = o.material as THREE.Material & { map?: THREE.Texture | null }
          mat.map?.dispose()
          mat.dispose()
        }
      })
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
