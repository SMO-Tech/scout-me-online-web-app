'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function AnimatedSphere({ position, color, scale }: { position: [number, number, number], color: string, scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={0.5}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = 200
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [particleCount])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial 
        size={0.08} 
        color="#a855f7" 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 opacity-60 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0)
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#9333ea" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[0, 5, 5]} intensity={1} color="#06b6d4" />
        
        {/* Animated Spheres - Larger and more visible */}
        <AnimatedSphere position={[-4, 2, 0]} color="#9333ea" scale={2} />
        <AnimatedSphere position={[4, -2, -2]} color="#3b82f6" scale={2.5} />
        <AnimatedSphere position={[0, 0, -4]} color="#06b6d4" scale={1.5} />
        
        {/* Floating Particles */}
        <FloatingParticles />
      </Canvas>
    </div>
  )
}

