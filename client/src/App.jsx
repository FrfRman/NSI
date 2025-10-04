import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import Earth from './components/Earth'
import Satellites from './components/Satellites'
import axios from 'axios'

export default function App() {
  const [tles, setTles] = useState([])
  const [selectedSat, setSelectedSat] = useState(null)
  const [satCount, setSatCount] = useState(100)
  // Removed customSat state
  const [famousSat, setFamousSat] = useState('')
  const [famousTles, setFamousTles] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/tle/visual')
        setTles(res.data.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
  }, [])

  // Always show the first N satellites for a smooth experience
  const shownTles = tles.slice(0, satCount)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />
        <Stars />
        <Earth />
        <Satellites
          tles={[...shownTles, ...famousTles]}
          onSelect={s => setSelectedSat(s)}
          selectedSat={selectedSat}
        />
        <OrbitControls enablePan={true} />
      </Canvas>
      <div style={{ position: 'absolute', left: 10, top: 10, color: 'white', minWidth: 220 }}>
        <h3>CosmicEye — Demo</h3>
  <p>Showing {shownTles.length + famousTles.length} satellites</p>
        <label htmlFor="satSlider">Number of satellites:</label>
        <input
          id="satSlider"
          type="range"
          min={1}
          max={tles.length || 100}
          value={satCount}
          onChange={e => setSatCount(Number(e.target.value))}
          style={{ width: 180 }}
        />
        <span style={{ marginLeft: 8 }}>{satCount}</span>
        <hr style={{ margin: '16px 0', borderColor: '#444' }} />
        <div>
          <h4>Add Famous Satellite</h4>
          <select
            value={famousSat}
            onChange={async e => {
              const val = e.target.value
              setFamousSat(val)
              if (!val) return
              // Map selection to CelesTrak URL
              let url = ''
              if (val === 'ISS') url = 'https://celestrak.com/NORAD/elements/stations.txt'
              if (val === 'Hubble') url = 'https://celestrak.com/NORAD/elements/science.txt'
              if (val === 'Starlink') url = 'https://celestrak.com/NORAD/elements/starlink.txt'
              if (url) {
                try {
                  const res = await fetch(url)
                  const text = await res.text()
                  // Parse TLEs
                  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
                  let found = null
                  if (val === 'ISS') {
                    // Find ISS (ZARYA)
                    for (let i = 0; i < lines.length - 2; i += 3) {
                      if (lines[i].toUpperCase().includes('ISS') || lines[i].toUpperCase().includes('ZARYA')) {
                        found = { name: lines[i], line1: lines[i+1], line2: lines[i+2] }
                        break
                      }
                    }
                  } else if (val === 'Hubble') {
                    // Find HST
                    for (let i = 0; i < lines.length - 2; i += 3) {
                      if (lines[i].toUpperCase().includes('HST') || lines[i].toUpperCase().includes('HUBBLE')) {
                        found = { name: lines[i], line1: lines[i+1], line2: lines[i+2] }
                        break
                      }
                    }
                  } else if (val === 'Starlink') {
                    // Just pick the first Starlink satellite
                    found = { name: lines[0], line1: lines[1], line2: lines[2] }
                  }
                  if (found) {
                    setFamousTles([found])
                  }
                } catch (err) {
                  alert('Failed to fetch TLE for ' + val)
                }
              }
            }}
            style={{ padding: 4, marginBottom: 8 }}
          >
            <option value="">Select satellite...</option>
            <option value="ISS">ISS (ZARYA)</option>
            <option value="Hubble">Hubble Space Telescope</option>
            <option value="Starlink">Starlink (first in list)</option>
          </select>
        </div>
        {/* Removed manual TLE input form */}
      </div>
      {selectedSat && (
        <div style={{ position: 'absolute', right: 10, top: 10, color: 'white', background: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 6 }}>
          <strong>{selectedSat.name}</strong>
        </div>
      )}
    </div>
  )
}
