import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uHover;
uniform float uScroll;
uniform float uRadius;
varying vec3 vViewPos;
varying vec3 vNormal;
varying float vDisp;
${noise}
float field(vec3 n){
  float slow = snoise(n * 0.95 + vec3(uTime * 0.16));
  float fine = snoise(n * 2.4 - vec3(uTime * 0.3));
  return slow * (0.16 + uHover * 0.08 + uScroll * 0.18) + fine * 0.03;
}
vec3 displace(vec3 q){
  vec3 n = normalize(q);
  return n * (uRadius + field(n));
}
void main(){
  vec3 n = normalize(position);
  vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 b = cross(n, t);
  float e = 0.01;
  vec3 p0 = displace(position);
  vec3 p1 = displace(position + t * e);
  vec3 p2 = displace(position + b * e);
  vNormal = normalize(normalMatrix * normalize(cross(p1 - p0, p2 - p0)));
  vDisp = length(p0) - uRadius;
  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const fragmentShader = /* glsl */ `
uniform float uTime;
varying vec3 vViewPos;
varying vec3 vNormal;
varying float vDisp;
void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vViewPos);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.6);
  vec3 r = reflect(-v, n);

  vec3 dark = vec3(0.0, 0.025, 0.01);
  vec3 neon = vec3(0.0, 0.42, 0.14);
  vec3 light = vec3(0.78, 1.0, 0.84);

  vec3 col = mix(dark, neon, smoothstep(-0.6, 0.9, r.y));
  float band = sin(r.y * 7.0 + r.x * 2.0 + uTime * 0.5) * 0.5 + 0.5;
  col = mix(col, light, pow(band, 12.0) * 0.45);

  vec3 L = normalize(vec3(0.5, 0.85, 0.6));
  float spec = pow(max(dot(r, L), 0.0), 56.0);

  col += light * spec * 1.2;
  col += vec3(0.0, 1.0, 0.25) * fres * 1.1;

  // linee olografiche che scorrono sulla superficie
  float scan = smoothstep(0.85, 1.0, sin(vViewPos.y * 46.0 - uTime * 3.0));
  col += vec3(0.0, 1.0, 0.25) * scan * 0.12;
  col *= 0.85 + vDisp * 0.9;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function GoldOrb({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2))
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 6.2)

    const uniforms = {
      uTime: { value: 0 },
      uHover: { value: 0 },
      uScroll: { value: 0 },
      uRadius: { value: 1.35 },
    }

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, small ? 40 : 72),
      new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader }),
    )
    scene.add(orb)

    // Anello di particelle: richiama i "dati" che orbitano attorno al metodo
    const count = small ? 1400 : 2600
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const radius = 2.1 + Math.pow(Math.random(), 2) * 1.4
      positions[i * 3] = Math.cos(a) * radius
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.18 * radius
      positions[i * 3 + 2] = Math.sin(a) * radius
    }
    const ringGeo = new THREE.BufferGeometry()
    ringGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const ring = new THREE.Points(
      ringGeo,
      new THREE.PointsMaterial({
        color: 0x00ff41,
        size: 0.018,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    ring.rotation.x = 0.42
    ring.rotation.z = -0.18
    scene.add(ring)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
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

    const clock = new THREE.Clock()
    let hover = 0
    let raf = 0

    const render = () => {
      raf = requestAnimationFrame(render)
      if (!visible) return
      const t = clock.getElapsedTime()
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      const dist = Math.min(1, Math.hypot(pointer.x, pointer.y))
      hover += ((1 - dist) - hover) * 0.04

      const scroll = Math.min(1, window.scrollY / window.innerHeight)
      uniforms.uTime.value = t
      uniforms.uHover.value = hover
      uniforms.uScroll.value = scroll

      orb.rotation.y = t * 0.12 + pointer.x * 0.5
      orb.rotation.x = pointer.y * 0.35
      orb.position.y = -scroll * 0.8
      const s = 1 - scroll * 0.18
      orb.scale.setScalar(s)

      ring.rotation.y = -t * 0.06 + pointer.x * 0.2
      ring.position.y = orb.position.y

      renderer.render(scene, camera)
    }

    if (reduced) {
      renderer.render(scene, camera)
    } else {
      render()
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      orb.geometry.dispose()
      ;(orb.material as THREE.Material).dispose()
      ringGeo.dispose()
      ;(ring.material as THREE.Material).dispose()
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
