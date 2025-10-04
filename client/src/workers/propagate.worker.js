import * as satellite from 'satellite.js'

// Convert km -> scene units (Earth radius 6371 km -> sphere radius 2)
const KM_TO_SCENE = 2 / 6371

let satrecs = []
let updateInterval = 200
let timeScale = 1
let timer = null

function tick() {
  const nowMs = Date.now()
  const simMs = nowMs * timeScale
  const simDate = new Date(simMs)
  const count = satrecs.length
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    try {
      const pv = satellite.propagate(satrecs[i], simDate)
      const pos = pv.position
      if (!pos) {
        out[i * 3 + 0] = NaN
        out[i * 3 + 1] = NaN
        out[i * 3 + 2] = NaN
        continue
      }
      // convert ECI (km) -> scene coords
      out[i * 3 + 0] = pos.x * KM_TO_SCENE
      out[i * 3 + 1] = pos.z * KM_TO_SCENE
      out[i * 3 + 2] = -pos.y * KM_TO_SCENE
    } catch (e) {
      out[i * 3 + 0] = NaN
      out[i * 3 + 1] = NaN
      out[i * 3 + 2] = NaN
    }
  }
  // Transfer the buffer back to main thread
  self.postMessage({ type: 'positions', buffer: out.buffer, count }, [out.buffer])
}

self.onmessage = (e) => {
  const msg = e.data
  if (!msg || !msg.type) return
  if (msg.type === 'init') {
    const tles = msg.tles || []
    satrecs = tles.map(t => satellite.twoline2satrec(t.line1, t.line2))
    if (timer) clearInterval(timer)
    timer = setInterval(tick, updateInterval)
    // send an immediate tick
    tick()
  } else if (msg.type === 'config') {
    if (typeof msg.updateInterval === 'number') {
      updateInterval = msg.updateInterval
      if (timer) { clearInterval(timer); timer = setInterval(tick, updateInterval) }
    }
    if (typeof msg.timeScale === 'number') timeScale = msg.timeScale
  } else if (msg.type === 'updateTles') {
    const tles = msg.tles || []
    satrecs = tles.map(t => satellite.twoline2satrec(t.line1, t.line2))
  } else if (msg.type === 'stop') {
    if (timer) { clearInterval(timer); timer = null }
  }
}
