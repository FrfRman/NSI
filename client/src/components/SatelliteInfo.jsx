import React from 'react'

export default function SatelliteInfo({ sat }) {
  if (!sat) return null
  // sat: { name, satrec }
  const { name } = sat

  return (
    <div style={{ position: 'absolute', right: 10, top: 10, color: 'white', background: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 6 }}>
      <h4>{name}</h4>
      <p>Realtime position computed via satellite.js</p>
      <small>Click another satellite to update</small>
    </div>
  )
}
