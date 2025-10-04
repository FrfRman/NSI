import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import * as satellite from 'satellite.js'

// Convert ECI position (km) to scene units (Earth radius ~6371 km -> sphere radius 2)
const KM_TO_SCENE = 2 / 6371

export default function Satellites({ tles, onSelect, selectedSat }) {
  const satRecs = useRef([])
  const lastPositions = useRef([])
  const nextPositions = useRef([])
  const lastUpdate = useRef(performance.now())
  const PROPAGATION_INTERVAL = 100 // ms
  const meshesRef = useRef([])

  // Initialize satRecs and positions when tles change
  useEffect(() => {
    satRecs.current = tles.map(t => {
      try {
        return { name: t.name, satrec: satellite.twoline2satrec(t.line1, t.line2) }
      } catch {
        return null
      }
    }).filter(Boolean)
    lastPositions.current = satRecs.current.map(() => new Vector3())
    nextPositions.current = satRecs.current.map(() => new Vector3())
    // Initial propagation
    const now = new Date()
    satRecs.current.forEach((s, i) => {
      const pv = satellite.propagate(s.satrec, now)
      if (pv.position) {
        lastPositions.current[i].set(
          pv.position.x * KM_TO_SCENE,
          pv.position.z * KM_TO_SCENE,
          -pv.position.y * KM_TO_SCENE
        )
        nextPositions.current[i].copy(lastPositions.current[i])
      }
    })
    lastUpdate.current = performance.now()
  }, [tles])

  // Propagate positions every PROPAGATION_INTERVAL ms for smoother animation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      satRecs.current.forEach((s, i) => {
        const pv = satellite.propagate(s.satrec, now)
        if (pv.position) {
          nextPositions.current[i].set(
            pv.position.x * KM_TO_SCENE,
            pv.position.z * KM_TO_SCENE,
            -pv.position.y * KM_TO_SCENE
          )
        }
      })
      lastUpdate.current = performance.now()
      // Swap buffers
      for (let i = 0; i < nextPositions.current.length; i++) {
        lastPositions.current[i].copy(nextPositions.current[i])
      }
    }, PROPAGATION_INTERVAL)
    return () => clearInterval(interval)
  }, [tles])

  // Interpolate positions each frame for smooth animation, clamped to propagation interval
  useFrame(() => {
    const now = performance.now()
    // Clamp alpha between 0 and 1, based on actual propagation interval
    const alpha = Math.max(0, Math.min(1, (now - lastUpdate.current) / PROPAGATION_INTERVAL))
    for (let i = 0; i < satRecs.current.length; i++) {
      const lp = lastPositions.current[i]
      const np = nextPositions.current[i]
      const mesh = meshesRef.current[i]
      if (mesh) {
        mesh.position.set(
          lp.x + (np.x - lp.x) * alpha,
          lp.y + (np.y - lp.y) * alpha,
          lp.z + (np.z - lp.z) * alpha
        )
      }
    }
  })

  return (
    <group>
      {satRecs.current.map((s, i) => {
        const isSelected = selectedSat && s.name === selectedSat.name && s.satrec.satnum === selectedSat.satrec?.satnum
        return (
          <mesh
            key={i}
            ref={el => meshesRef.current[i] = el}
            onClick={() => onSelect && onSelect(s)}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              emissive={isSelected ? '#0f0' : '#88f'}
              color={isSelected ? '#0f0' : '#aaf'}
            />
          </mesh>
        )
      })}
    </group>
  )
}
