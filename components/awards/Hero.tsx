import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const GREEN_CORE = '#00ff94'
const GREEN_GLOW = '#39d98a'

export default function AwardsHero() {
  const container = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(container.current)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.hero-eyebrow', { opacity: 0, y: -20, duration: 0.8 })
      .from('.hero-title', { opacity: 0, y: 40, duration: 1.2 }, '-0.5')
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-0.8')
      .from('.hero-cta', { opacity: 0, scale: 0.8, duration: 0.8 }, '-0.4')

    // Parallax on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2
      const y = (e.clientY / innerHeight - 0.5) * 2
      gsap.set('.hero-canvas', {
        transform: `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`,
      })
    }
    container.current?.addEventListener('mousemove', handleMouseMove)
    return () => {
      container.current?.removeEventListener('mousemove', handleMouseMove)
      ctx.revert()
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg-void">
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <div className="hero-eyebrow mb-4 text-xs uppercase tracking-widest text-green-lime">
            NOIACORE — Applied AI & Open Education
          </div>

          <h1
            ref={titleRef}
            className="hero-title text-5xl font-black text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            style={{
              background: `linear-gradient(135deg, ${GREEN_CORE} 0%, ${GREEN_CORE} 50%, ${GREEN_GLOW} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 40px ${GREEN_CORE}30)`,
            }}
          >
            Belentani
          </h1>

          <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-xl text-text-secondary">
            Artist universe, creative technology, and open education.
            Eight canonical projects. Zero compromise.
          </p>

          <div className="hero-cta mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://belentani.es"
              className="btn-primary px-8 py-4 text-lg"
            >
              Enter the Universe
            </a>
            <a
              href="https://github.com/belentani7"
              className="btn-secondary px-8 py-4 text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source
            </a>
          </div>

          <div className="mt-16 opacity-60">
            <div className="mb-2 text-xs tracking-widest text-text-tertiary">
              SCROLL TO EXPLORE
            </div>
            <div className="mx-auto h-8 w-px animate-pulse bg-green-core/30"></div>
          </div>
        </div>
      </div>

      <div className="hero-canvas absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[0x050e0a00]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} color={GREEN_CORE} />

          <OrbitingTorus />
          <FloatingGeometry position={[-4, 2, -2]} />
          <FloatingGeometry position={[5, -1, -3]} />
          <FloatingGeometry position={[2, -3, -5]} />

          <ContactShadows
            position={[0, -5, 0]}
            opacity={0.2}
            scale={20}
            blur={2}
            far={5}
          />

          <Environment preset="night" />

          <OrbitControlsHidden />
        </Canvas>
      </div>
    </section>
  )
}

function OrbitingTorus() {
  const mesh = useRef<THREE.Mesh>(null!)

  useGSAP(() => {
    if (mesh.current) {
      gsap.to(mesh.current.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 25,
        ease: 'none',
        repeat: -1,
      })
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <torusGeometry args={[4, 0.1, 32, 100]} />
      <MeshTransmissionMaterial
        color={GREEN_CORE}
        emissive={GREEN_CORE}
        emissiveIntensity={0.8}
        thickness={0.2}
        roughness={0.1}
        metalness={0.9}
        ior={1.5}
        chromaSamples={14}
      />
    </mesh>
  )
}

interface GeoProps {
  position: [number, number, number]
}

function FloatingGeometry({ position }: GeoProps) {
  const mesh = useRef<THREE.Mesh>(null!)
  const isOctahedron = Math.random() > 0.5

  useGSAP(() => {
    if (!mesh.current) return
    gsap.to(mesh.current.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      duration: 15 + Math.random() * 15,
      ease: 'none',
      repeat: -1,
    })
    gsap.to(mesh.current.scale, {
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      x: 1.2,
      y: 1.2,
      z: 1.2,
    })
  })

  return (
    <mesh ref={mesh} position={position}>
      {isOctahedron ? <octahedronGeometry args={[0.3]} /> : <icosahedronGeometry args={[0.3, 0]} />}
      <meshStandardMaterial
        color={GREEN_GLOW}
        emissive={GREEN_CORE}
        emissiveIntensity={0.6}
        wireframe={Math.random() > 0.5}
      />
    </mesh>
  )
}

function OrbitControlsHidden() {
  return null
}
