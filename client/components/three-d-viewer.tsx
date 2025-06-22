"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html, Grid, useTexture } from "@react-three/drei"

// Basketball court dimensions (in meters)
const COURT_LENGTH = 28.65 // 94ft
const COURT_WIDTH = 15.24 // 50ft

// Player component to represent basketball players
function Player({ position, color, number, isSelected = false }) {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      // Add a slight hovering animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.05
    }
  })

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Player body */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Player number */}
      <Text position={[0, 0, 0.45]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        {number}
      </Text>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.9, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      )}
    </group>
  )
}

// Basketball component
function Basketball({ position }) {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshStandardMaterial color="#e67e22" />
    </mesh>
  )
}

// Court component
function Court() {
  const courtTexture = useTexture("/placeholder.svg?height=1024&width=2048")

  return (
    <group>
      {/* Court floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[COURT_LENGTH, COURT_WIDTH]} />
        <meshStandardMaterial map={courtTexture} color="#f5f5dc" />
      </mesh>

      {/* Court grid for reference */}
      <Grid
        args={[COURT_LENGTH, COURT_WIDTH, 10, 10]}
        position={[0, 0.01, 0]}
        cellColor="#aaaaaa"
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionColor="#555555"
        sectionThickness={1}
        fadeDistance={30}
        infiniteGrid={false}
      />
    </group>
  )
}

// Scene component that contains all 3D elements
function Scene() {
  // Sample player positions
  const players = [
    { id: 1, position: [-4, 1, -2], color: "#3498db", number: "1", team: "offense" },
    { id: 2, position: [2, 1, -4], color: "#3498db", number: "2", team: "offense" },
    { id: 3, position: [-6, 1, 2], color: "#3498db", number: "3", team: "offense" },
    { id: 4, position: [5, 1, 3], color: "#3498db", number: "4", team: "offense" },
    { id: 5, position: [0, 1, 4], color: "#3498db", number: "5", team: "offense" },

    { id: 6, position: [-3.5, 1, -2.5], color: "#e74c3c", number: "6", team: "defense" },
    { id: 7, position: [2.5, 1, -3.5], color: "#e74c3c", number: "7", team: "defense" },
    { id: 8, position: [-5.5, 1, 1.5], color: "#e74c3c", number: "8", team: "defense" },
    { id: 9, position: [5.5, 1, 2.5], color: "#e74c3c", number: "9", team: "defense" },
    { id: 10, position: [0.5, 1, 3.5], color: "#e74c3c", number: "10", team: "defense" },
  ]

  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [showLabels, setShowLabels] = useState(true)
  const { camera } = useThree()

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 15, 15)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      {/* Environment and lighting */}
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Court */}
      <Court />

      {/* Players */}
      {players.map((player) => (
        <Player
          key={player.id}
          position={player.position}
          color={player.color}
          number={player.number}
          isSelected={selectedPlayer === player.id}
        />
      ))}

      {/* Basketball */}
      <Basketball position={[1, 1.2, -3]} />

      {/* Player labels */}
      {showLabels &&
        players.map((player) => (
          <Html
            key={`label-${player.id}`}
            position={[player.position[0], player.position[1] + 2, player.position[2]]}
            center
            distanceFactor={10}
          >
            <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              #{player.number} - {player.team === "offense" ? "Offense" : "Defense"}
            </div>
          </Html>
        ))}

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below the court
      />
    </>
  )
}

export function ThreeDViewer() {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
