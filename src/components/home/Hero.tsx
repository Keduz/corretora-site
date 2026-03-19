'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Group, LineSegments, Color, Mesh, LineBasicMaterial as LBM } from 'three'

interface BuildingConfig {
  label: string
  x: number
  z: number
  w: number
  h: number
  d: number
  hasRoof?: boolean
}

const BUILDINGS: BuildingConfig[] = [
  // Back row (tallest)
  { label: 'Cobertura Premium', x: -4, z: -3, w: 1.5, h: 6, d: 1.5 },
  { label: 'Apartamento', x: -1.5, z: -3.5, w: 1.2, h: 4.5, d: 1.2 },
  { label: 'Penthouse', x: 1.5, z: -3, w: 1.8, h: 7, d: 1.4 },
  { label: 'Residencial', x: 4, z: -3.5, w: 1.3, h: 5, d: 1.3 },
  // Middle row
  { label: 'Flat Executivo', x: -5.5, z: -0.5, w: 1, h: 3.5, d: 1 },
  { label: 'Studio Moderno', x: -2.5, z: 0, w: 0.9, h: 3, d: 0.9 },
  { label: 'Cobertura Duplex', x: 0, z: -0.5, w: 2, h: 5.5, d: 1.5 },
  { label: 'Loft', x: 2.5, z: 0, w: 1.1, h: 3, d: 1 },
  { label: 'Apartamento', x: 5.5, z: -0.5, w: 1, h: 4, d: 1 },
  // Front row (houses with roofs)
  { label: 'Casa de Luxo', x: -3.5, z: 2, w: 1.6, h: 1.2, d: 1.6, hasRoof: true },
  { label: 'Mansão', x: 0, z: 2.5, w: 2, h: 1.5, d: 2, hasRoof: true },
  { label: 'Sobrado', x: 3.5, z: 2, w: 1.4, h: 1.8, d: 1.4, hasRoof: true },
]

const GOLD = 0xd4a843
const GOLD_LIGHT = 0xe8c96a
const GOLD_DIM = 0x8a7030
const PARTICLE_COUNT = 150
const FOLLOWER_COUNT = 25
const ENTRY_DURATION = 2000

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.5 + i * 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    let animFrameId: number
    const cleanupFns: (() => void)[] = []

    ;(async () => {
      const THREE = await import('three')
      if (!mounted || !containerRef.current) return

      const container = containerRef.current
      let width = container.clientWidth
      let height = container.clientHeight

      // ── Scene ──
      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x1a1a1a, 0.035)

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
      camera.position.set(0, 7, 12)
      camera.lookAt(0, 1, 0)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x1a1a1a)
      container.appendChild(renderer.domElement)

      const world = new THREE.Group()
      scene.add(world)

      const goldColor = new THREE.Color(GOLD)
      const goldLightColor = new THREE.Color(GOLD_LIGHT)

      // ── Ground glow ──
      const glowCanvas = document.createElement('canvas')
      glowCanvas.width = 256
      glowCanvas.height = 256
      const ctx = glowCanvas.getContext('2d')!
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      grad.addColorStop(0, 'rgba(212, 168, 67, 0.12)')
      grad.addColorStop(0.5, 'rgba(212, 168, 67, 0.04)')
      grad.addColorStop(1, 'rgba(212, 168, 67, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 256, 256)
      const glowTex = new THREE.CanvasTexture(glowCanvas)
      const glowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshBasicMaterial({
          map: glowTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
      glowPlane.rotation.x = -Math.PI / 2
      glowPlane.position.y = 0.02
      world.add(glowPlane)

      // ── Grid ──
      const grid = new THREE.GridHelper(
        20, 20,
        new THREE.Color(GOLD_DIM),
        new THREE.Color(0x2d2d2d)
      )
      const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material]
      gridMats.forEach(m => {
        m.opacity = 0.12
        m.transparent = true
      })
      world.add(grid)

      // ── Buildings ──
      interface BuildingObj {
        group: Group
        config: BuildingConfig
        lines: LineSegments[]
        targetY: number
        origColors: Color[]
        origOpacities: number[]
      }

      const buildings: BuildingObj[] = []

      BUILDINGS.forEach((cfg, idx) => {
        const group = new THREE.Group()
        const lines: LineSegments[] = []
        const origColors: Color[] = []
        const origOpacities: number[] = []

        // Main body wireframe
        const bodyGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d)
        const bodyEdges = new THREE.EdgesGeometry(bodyGeo)
        const bodyMat = new THREE.LineBasicMaterial({
          color: goldColor.clone(),
          transparent: true,
          opacity: 0.65,
        })
        const bodyLine = new THREE.LineSegments(bodyEdges, bodyMat)
        bodyLine.position.y = cfg.h / 2
        group.add(bodyLine)
        lines.push(bodyLine)
        origColors.push(goldColor.clone())
        origOpacities.push(0.65)
        bodyGeo.dispose()

        // Roof for houses
        if (cfg.hasRoof) {
          const roofH = cfg.h * 0.6
          const roofGeo = new THREE.ConeGeometry(
            Math.max(cfg.w, cfg.d) * 0.78,
            roofH,
            4
          )
          const roofEdges = new THREE.EdgesGeometry(roofGeo)
          const roofMat = new THREE.LineBasicMaterial({
            color: goldColor.clone(),
            transparent: true,
            opacity: 0.65,
          })
          const roofLine = new THREE.LineSegments(roofEdges, roofMat)
          roofLine.position.y = cfg.h + roofH / 2
          roofLine.rotation.y = Math.PI / 4
          group.add(roofLine)
          lines.push(roofLine)
          origColors.push(goldColor.clone())
          origOpacities.push(0.65)
          roofGeo.dispose()
        }

        // Floor dividers for taller buildings
        if (cfg.h > 2) {
          const floorCount = Math.floor(cfg.h / 0.8)
          for (let f = 1; f < floorCount; f++) {
            const y = f * 0.8
            const halfW = cfg.w * 0.45
            const halfD = cfg.d / 2 + 0.005
            const pts = [
              new THREE.Vector3(-halfW, y, halfD),
              new THREE.Vector3(halfW, y, halfD),
            ]
            const floorGeo = new THREE.BufferGeometry().setFromPoints(pts)
            const floorMat = new THREE.LineBasicMaterial({
              color: goldColor.clone(),
              transparent: true,
              opacity: 0.3,
            })
            const floorLine = new THREE.LineSegments(floorGeo, floorMat)
            group.add(floorLine)
            lines.push(floorLine)
            origColors.push(goldColor.clone())
            origOpacities.push(0.3)
          }
        }

        // Window details for medium buildings (2-4 height)
        if (cfg.h >= 2 && cfg.h <= 4) {
          const windowRows = Math.floor(cfg.h / 1.2)
          for (let r = 0; r < windowRows; r++) {
            const wy = 0.6 + r * 1.2
            const windowSize = 0.2
            const spacing = cfg.w / 3
            for (let c = -1; c <= 1; c += 2) {
              const wx = c * spacing * 0.5
              const wz = cfg.d / 2 + 0.006
              const winPts = [
                new THREE.Vector3(wx - windowSize, wy - windowSize, wz),
                new THREE.Vector3(wx + windowSize, wy - windowSize, wz),
                new THREE.Vector3(wx + windowSize, wy - windowSize, wz),
                new THREE.Vector3(wx + windowSize, wy + windowSize, wz),
                new THREE.Vector3(wx + windowSize, wy + windowSize, wz),
                new THREE.Vector3(wx - windowSize, wy + windowSize, wz),
                new THREE.Vector3(wx - windowSize, wy + windowSize, wz),
                new THREE.Vector3(wx - windowSize, wy - windowSize, wz),
              ]
              const winGeo = new THREE.BufferGeometry().setFromPoints(winPts)
              const winMat = new THREE.LineBasicMaterial({
                color: goldColor.clone(),
                transparent: true,
                opacity: 0.25,
              })
              const winLine = new THREE.LineSegments(winGeo, winMat)
              group.add(winLine)
              lines.push(winLine)
              origColors.push(goldColor.clone())
              origOpacities.push(0.25)
            }
          }
        }

        // Invisible hitbox for raycasting
        const totalH = cfg.h + (cfg.hasRoof ? cfg.h * 0.6 : 0)
        const hitGeo = new THREE.BoxGeometry(cfg.w + 0.3, totalH + 0.3, cfg.d + 0.3)
        const hitMat = new THREE.MeshBasicMaterial({ visible: false })
        const hitbox = new THREE.Mesh(hitGeo, hitMat)
        hitbox.position.y = totalH / 2
        hitbox.userData = { buildingIdx: idx }
        group.add(hitbox)

        group.position.set(cfg.x, -12, cfg.z)
        world.add(group)

        buildings.push({
          group,
          config: cfg,
          lines,
          targetY: 0,
          origColors,
          origOpacities,
        })
      })

      // ── Ambient Particles ──
      const pPositions = new Float32Array(PARTICLE_COUNT * 3)
      const pSpeeds = new Float32Array(PARTICLE_COUNT)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * 22
        pPositions[i * 3 + 1] = Math.random() * 12
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * 16
        pSpeeds[i] = 0.003 + Math.random() * 0.008
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
      const pMat = new THREE.PointsMaterial({
        color: GOLD_LIGHT,
        size: 0.06,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      world.add(new THREE.Points(pGeo, pMat))

      // ── Cursor Follower Particles ──
      const fPositions = new Float32Array(FOLLOWER_COUNT * 3)
      const fOffsets = new Float32Array(FOLLOWER_COUNT * 3)
      for (let i = 0; i < FOLLOWER_COUNT; i++) {
        fPositions[i * 3] = 0
        fPositions[i * 3 + 1] = 5
        fPositions[i * 3 + 2] = 0
        fOffsets[i * 3] = (Math.random() - 0.5) * 2
        fOffsets[i * 3 + 1] = (Math.random() - 0.5) * 2
        fOffsets[i * 3 + 2] = (Math.random() - 0.5) * 2
      }
      const fGeo = new THREE.BufferGeometry()
      fGeo.setAttribute('position', new THREE.BufferAttribute(fPositions, 3))
      const fMat = new THREE.PointsMaterial({
        color: GOLD_LIGHT,
        size: 0.04,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      scene.add(new THREE.Points(fGeo, fMat))

      // ── Interaction State ──
      const mouse = { x: 0, y: 0 }
      const targetRot = { x: 0, y: 0 }
      const raycaster = new THREE.Raycaster()
      const mouseVec = new THREE.Vector2()
      const mousePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -5)
      const mouseWorldPos = new THREE.Vector3(0, 5, 0)
      let hoveredIdx = -1
      let isZooming = false
      const originalCamPos = camera.position.clone()
      const originalLookAt = new THREE.Vector3(0, 1, 0)

      // Collect all hitboxes once
      const hitboxes = buildings.map(
        b => b.group.children.find(c => (c as Mesh).isMesh) as Mesh
      )

      const resetHover = () => {
        if (hoveredIdx >= 0) {
          const prev = buildings[hoveredIdx]
          prev.lines.forEach((l, li) => {
            const mat = l.material as LBM
            mat.color.copy(prev.origColors[li])
            mat.opacity = prev.origOpacities[li]
          })
          prev.group.scale.setScalar(1)
          hoveredIdx = -1
        }
        if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
        container.style.cursor = 'default'
      }

      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

        // Parallax target
        targetRot.y = mouse.x * 0.12
        targetRot.x = mouse.y * 0.06

        // Mouse world position for follower particles
        mouseVec.set(mouse.x, mouse.y)
        raycaster.setFromCamera(mouseVec, camera)
        raycaster.ray.intersectPlane(mousePlane, mouseWorldPos)

        if (isZooming) return

        // Raycast for building hover
        const intersects = raycaster.intersectObjects(hitboxes)

        resetHover()

        if (intersects.length > 0) {
          const idx = intersects[0].object.userData.buildingIdx
          if (idx !== undefined && idx >= 0) {
            hoveredIdx = idx
            const b = buildings[idx]
            container.style.cursor = 'pointer'

            // Highlight
            b.lines.forEach(l => {
              const mat = l.material as LBM
              mat.color.set(goldLightColor)
              mat.opacity = Math.min(mat.opacity + 0.35, 1)
            })
            b.group.scale.setScalar(1.08)

            // Tooltip position
            if (tooltipRef.current) {
              const wp = new THREE.Vector3()
              b.group.getWorldPosition(wp)
              const totalH = b.config.h + (b.config.hasRoof ? b.config.h * 0.6 : 0)
              wp.y += totalH + 0.5
              wp.project(camera)
              const tx = (wp.x * 0.5 + 0.5) * width
              const ty = (-wp.y * 0.5 + 0.5) * height
              tooltipRef.current.style.left = `${tx}px`
              tooltipRef.current.style.top = `${ty}px`
              tooltipRef.current.style.opacity = '1'
              tooltipRef.current.textContent = b.config.label
            }
          }
        }
      }

      const onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1
        targetRot.y = mouse.x * 0.12
        targetRot.x = mouse.y * 0.06
      }

      const onClick = () => {
        if (hoveredIdx < 0 || isZooming) return
        isZooming = true
        const b = buildings[hoveredIdx]
        const target = new THREE.Vector3()
        b.group.getWorldPosition(target)
        const zoomTo = target.clone().add(new THREE.Vector3(2, 3, 4))
        const startPos = camera.position.clone()
        let t = 0

        const zoomIn = () => {
          t += 0.025
          if (t >= 1) {
            setTimeout(() => {
              let t2 = 0
              const zoomOut = () => {
                t2 += 0.02
                if (t2 >= 1) {
                  camera.position.copy(originalCamPos)
                  camera.lookAt(originalLookAt)
                  isZooming = false
                  return
                }
                const e = 1 - Math.pow(1 - t2, 3)
                camera.position.lerpVectors(zoomTo, originalCamPos, e)
                const look = new THREE.Vector3().lerpVectors(target, originalLookAt, e)
                look.y = THREE.MathUtils.lerp(target.y + 1, originalLookAt.y, e)
                camera.lookAt(look)
                requestAnimationFrame(zoomOut)
              }
              zoomOut()
            }, 400)
            return
          }
          const e = 1 - Math.pow(1 - t, 3)
          camera.position.lerpVectors(startPos, zoomTo, e)
          const look = new THREE.Vector3().lerpVectors(originalLookAt, target, e)
          look.y = THREE.MathUtils.lerp(originalLookAt.y, target.y + 1, e)
          camera.lookAt(look)
          requestAnimationFrame(zoomIn)
        }
        zoomIn()
      }

      container.addEventListener('mousemove', onMouseMove)
      container.addEventListener('touchmove', onTouchMove, { passive: true })
      container.addEventListener('click', onClick)

      // ── Animation Loop ──
      const startTime = performance.now()
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

      const animate = () => {
        if (!mounted) return
        animFrameId = requestAnimationFrame(animate)

        const now = performance.now()
        const elapsed = now - startTime

        // Entry: buildings rise from below
        buildings.forEach((b, i) => {
          const delay = i * 120
          const t = Math.max(0, Math.min(1, (elapsed - delay) / ENTRY_DURATION))
          b.group.position.y = THREE.MathUtils.lerp(-12, b.targetY, easeOut(t))
        })

        // Parallax (smooth lerp toward target)
        world.rotation.y += (targetRot.y - world.rotation.y) * 0.03
        world.rotation.x += (targetRot.x - world.rotation.x) * 0.03

        // Gentle auto-rotation
        if (!isZooming) {
          targetRot.y += 0.00015
        }

        // Ambient particles float upward
        const pos = pGeo.attributes.position.array as Float32Array
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          pos[i * 3 + 1] += pSpeeds[i]
          if (pos[i * 3 + 1] > 12) pos[i * 3 + 1] = 0
          pos[i * 3] += Math.sin(now * 0.0005 + i * 0.5) * 0.002
        }
        pGeo.attributes.position.needsUpdate = true

        // Follower particles drift toward cursor
        const fp = fGeo.attributes.position.array as Float32Array
        for (let i = 0; i < FOLLOWER_COUNT; i++) {
          const speed = 0.01 + i * 0.002
          fp[i * 3] += (mouseWorldPos.x + fOffsets[i * 3] - fp[i * 3]) * speed
          fp[i * 3 + 1] += (mouseWorldPos.y + fOffsets[i * 3 + 1] - fp[i * 3 + 1]) * speed
          fp[i * 3 + 2] += (mouseWorldPos.z + fOffsets[i * 3 + 2] - fp[i * 3 + 2]) * speed
          // Oscillation
          fOffsets[i * 3] += Math.sin(now * 0.001 + i) * 0.003
          fOffsets[i * 3 + 1] += Math.cos(now * 0.0012 + i * 2) * 0.003
        }
        fGeo.attributes.position.needsUpdate = true

        renderer.render(scene, camera)
      }

      animate()

      // ── Resize ──
      const onResize = () => {
        if (!containerRef.current) return
        width = containerRef.current.clientWidth
        height = containerRef.current.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
      window.addEventListener('resize', onResize)

      // ── Cleanup ──
      cleanupFns.push(() => {
        container.removeEventListener('mousemove', onMouseMove)
        container.removeEventListener('touchmove', onTouchMove)
        container.removeEventListener('click', onClick)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      })
    })()

    return () => {
      mounted = false
      if (animFrameId) cancelAnimationFrame(animFrameId)
      cleanupFns.forEach(fn => fn())
    }
  }, [])

  return (
    <section
      className="relative h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden"
      style={{ background: '#1a1a1a' }}
    >
      {/* Three.js canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Building tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 px-3 py-1.5 rounded text-sm whitespace-nowrap backdrop-blur-sm"
        style={{
          opacity: 0,
          transition: 'opacity 0.2s ease',
          transform: 'translate(-50%, -100%) translateY(-8px)',
          background: 'rgba(45, 45, 45, 0.9)',
          border: '1px solid rgba(212, 168, 67, 0.3)',
          color: '#d4a843',
        }}
      />

      {/* Gradient overlays for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #1a1a1a 0%, transparent 40%)' }}
      />
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,26,26,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center px-5 md:px-10 pointer-events-none">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/logo.png"
              alt="Jeova Guedes Imoveis"
              className="h-20 md:h-24 w-auto brightness-0 invert drop-shadow-[0_0_20px_rgba(212,168,67,0.4)]"
            />
          </motion.div>

          {/* Animated gold divider */}
          <motion.div
            className="gold-divider mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Nossos Im&oacute;veis
          </motion.h1>

          <motion.p
            className="mt-4 text-lg max-w-xl mx-auto"
            style={{ color: '#c4b89a' }}
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Encontre o im&oacute;vel ideal em Salvador, Feira de Santana e Alagoinhas
          </motion.p>

          <motion.div
            className="mt-8"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link
              href="/imoveis"
              className="pointer-events-auto inline-flex items-center gap-2 px-8 py-4 font-medium rounded-lg border-2 transition-all duration-300"
              style={{ borderColor: '#d4a843', color: '#d4a843' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#d4a843'
                e.currentTarget.style.color = '#1a1a1a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#d4a843'
              }}
            >
              Explorar Im&oacute;veis
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
