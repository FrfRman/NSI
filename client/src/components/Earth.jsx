import React from 'react'

import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

export default function Earth() {
  const texture = useLoader(TextureLoader, '/earthmap.jpg')
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
