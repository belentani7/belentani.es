import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, useGLTF, Text3D, Center } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import * as THREE

const GREEN_CORE = '#00ff94'
const GREEN_GLOW = '#39d98a'

export default function Galaxy() {
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<any>(null)

  useGSAP(() => {
    if (!container.current) return

    const ctx = gsap.context(container)

    gsap.fromTo(
      '.galaxy-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    )

    gsap.fromTo(
      '.galaxy-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 0.8, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
    )

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg-void">
      <div ref={container} className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <h1 className="galaxy-title text-6xl font-black text-text-primary md:text-8xl" style={{
          background: `linear-gradient(90deg, ${GREEN_CORE}, ${GREEN_GLOW})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 20px ${GREEN_CORE}60)`,
        }}>
          BELANTANI UNIVERSE
        </h1>
        <p className="galaxy-subtitle mt-4 max-w-2xl text-center text-text-secondary">
          Artist universe. Creative technology. Open education.
        </p>
      </div>

      <Canvas
        ref={canvas}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        className="absolute inset-0 z-0"
      >
        <color attach="background" args={[0x050e0a]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color={GREEN_GLOW} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={GREEN_CORE} />

        <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} />

        <GalaxyScene />

        <EffectComposer>
          <Bloom
            kernelSize={3}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
            intensity={2}
            blendFunction={BlendFunction.ADD}
          />
          <Vignette
            eskil={0.5}
            offset={0.2}
            blendFunction={BlendFunction.NORMAL}
            opacity={0.3}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.1}
          minPolarAngle={Math.PI / 2 - 0.3}
          maxPolarAngle={Math.PI / 2 + 0.3}
        />
      </Canvas>

      <div className="relative z-10 mb-12 text-center">
        <div className="flex items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="h-px w-16 bg-green-core/30" />
          <span className="text-xs uppercase tracking-widest text-text-tertiary">
            Artist Universe — Judas Era is Canon 0
          </span>
          <div className="h-px w-16 bg-green-core/30" />
        </div>
      </div>
    </section>
  )
}

function GalaxyScene() {
  const planet1 = useRef<THREE.Mesh>(null!)
  const planet2 = useRef<THREE.Mesh>(null!)
  const planet3 = useRef<THREE.Mesh>(null!)

  useGSAP(() => {
    if (planet1.current) {
      gsap.to(planet1.current.rotation, {
        y: Math.PI * 2,
        duration: 30,
        ease: 'none',
        repeat: -1,
      })
    }
    if (planet2.current) {
      gsap.to(planet2.current.rotation, {
        y: -Math.PI * 2,
        duration: 45,
        ease: 'none',
        repeat: -1,
      })
    }
    if (planet3.current) {
      gsap.to(planet3.current.rotation, {
        y: Math.PI * 2,
        duration: 60,
        ease: 'none',
        repeat: -1,
      })
    }
  })

  return (
    <>
      <mesh ref={planet1} position={[-4, 1, -2]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={GREEN_CORE} emissive={GREEN_CORE} emissiveIntensity={0.5} />
      </mesh>

      <mesh ref={planet2} position={[5, -1, -4]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={GREEN_GLOW} emissive={GREEN_GLOW} emissiveIntensity={0.4} />
      </mesh>

      <mesh ref={planet3} position={[2, 3, -6]}>
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial color={GREEN_GLOW} emissive={GREEN_CORE} emissiveIntensity={0.6} wireframe />
      </mesh>

      <Center>
        <Text3D
          font="/fonts/Geist-Bold.json"
          size={0.3}
          height={0.05}
          letterSpacing={-0.03}
        >
          <meshStandardMaterial color={GREEN_CORE} emissive={GREEN_CORE} emissiveIntensity={0.8} />
        </Text3D>
      </Center>
    </>
  )
}
