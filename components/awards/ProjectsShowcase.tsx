import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, MeshDistortMaterial } from '@react-three/drei'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { Button } from '@belentani/ui'

const GREEN_CORE = '#00ff94'
const GREEN_GLOW = '#39d98a'

const projects = [
  {
    id: 'belentani-universe',
    title: 'Belentani Universe',
    subtitle: 'Artist universe & creative technology',
    status: '🟢 READY',
    href: 'https://belentani.es',
    tags: ['Next.js', 'Three.js', 'GSAP', 'WebGL'],
  },
  {
    id: 'manos-abiertas',
    title: 'Manos Abiertas',
    subtitle: 'Educación, IA y derechos para migrantes',
    status: '🟡 IN PROGRESS',
    href: 'https://manos-abiertas-psi.vercel.app',
    tags: ['React', 'Vite', 'AI', 'Offline'],
  },
  {
    id: 'linguaforge',
    title: 'LinguaForge',
    subtitle: 'Open source language learning (CEFR)',
    status: '🟢 READY',
    href: 'https://linguaforge.vercel.app',
    tags: ['React', 'Vite', 'SRS', 'AI Tutor'],
  },
  {
    id: 'secure-t',
    title: 'Secure T',
    subtitle: 'Cybersecurity campus & AI governance',
    status: '🟢 READY',
    href: 'https://belentani7.github.io/secure-t/',
    tags: ['HTML', 'Python', 'Gitleaks', 'pytest'],
  },
  {
    id: 'open-school',
    title: 'Open School',
    subtitle: 'Digital institute for newcomers',
    status: '🟡 IN PROGRESS',
    href: 'https://open-school-gamma.vercel.app',
    tags: ['React', 'Vite', 'PWA', 'Offline'],
  },
  {
    id: 'belentani-cv-ai',
    title: 'Belentani CV-AI',
    subtitle: 'AI-powered document studio (GDPR compliant)',
    status: '🟡 IN PROGRESS',
    href: 'https://belentani-cv-ai.vercel.app',
    tags: ['Next.js 15', 'AI', 'Prisma', 'shadcn/ui'],
  },
  {
    id: 'cruzando',
    title: 'Cruzando el Charco',
    subtitle: 'LGBTQI+ migrant guide (Spanish Catalonia)',
    status: '🟢 READY',
    href: 'https://cruzando.elbelentani.cat',
    tags: ['Static', 'PWA', 'i18n', 'Accessibility'],
  },
  {
    id: 'judas-experience',
    title: 'Judas Experience',
    subtitle: 'Judas Era — Chapter 1 of the artist universe',
    status: '🔴 BLOCKED',
    href: 'https://judas-experience-13898.buildaispace.app/',
    tags: ['WebGL', 'HTML', 'Audio', 'Storytelling'],
  },
]

export default function ProjectsShowcase() {
  const section = useRef<HTMLDivElement>(null)
  const cards = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(section)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5,
      },
    })

    tl.from('.showcase-title', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
    })

    tl.from('.showcase-grid > *', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    }, '-0.3')

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={section}
      className="relative py-24 md:py-32 bg-bg-void"
    >
      <div className="container mx-auto px-6">
        <h2 className="showcase-title text-4xl font-black text-text-primary md:text-5xl">
          <span style={{
            background: `linear-gradient(90deg, ${GREEN_CORE}, ${GREEN_GLOW})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Canonical Projects
          </span>
        </h2>
        <p className="mt-4 text-text-secondary">
          8 projects. One unified vision. From art to education to cybersecurity.
        </p>

        <div
          ref={cards}
          className="showcase-grid mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: {
    id: string
    title: string
    subtitle: string
    status: string
    href: string
    tags: string[]
  }
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className="relative h-full rounded-2xl border border-border bg-bg-elevated p-6 transition-all duration-300"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-text-tertiary">
              {project.id}
            </span>
            <h3 className="mt-2 text-xl font-bold text-text-primary">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {project.subtitle}
            </p>
            <span className="mt-3 inline-block text-xs font-medium">
              {project.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-green-core/10 px-2 py-1 text-xs text-green-lime"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${GREEN_CORE}30, transparent 70%)`,
          }}
        />
      </div>
    </a>
  )
}
