'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGalaxyMap } from '@/hooks/useGalaxyMap';
import { GalaxyNode } from '@/design-system/components/GalaxyNode';
import { Ship } from './Ship';
import { Route } from './Route';
import { DockPanel } from '@/design-system/components/DockPanel';
import { HUD } from './HUD';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useGalaxyStore } from '@/store/galaxy';
import { cn } from '@/lib/utils';
import { NebulaField } from './NebulaField';
import { LorePanel } from './LorePanel';

export function GalaxyMap() {
  const { current, travelTo, allSystems, neighbors, navigate } = useGalaxyMap();
  const reduced = useReducedMotion();
  const { current: storeCurrent, travelTo: storeTravelTo } = useGalaxyStore();

  const handleNodeClick = (id: string) => {
    storeTravelTo(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') navigate('next');
    if (e.key === 'ArrowLeft') navigate('prev');
    if (e.key === 'Escape') storeTravelTo('belentani');
  };

  return (
    <div className="relative h-screen w-full" onKeyDown={handleKeyDown} tabIndex={0}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 50 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
        style={{ touchAction: 'none' }}
      >
        <color attach="background" args={['#030008']} />
        <Stars radius={300} depth={120} count={6500} factor={3.6} saturation={0.15} fade speed={0.18} />
        <NebulaField />
        <Routes current={current} />
        <Nodes current={current} onNodeClick={handleNodeClick} />
        <Ship current={current} reduced={reduced} />
      </Canvas>
      <DockPanel systemId={current} onAction={handleAction} onClose={() => storeTravelTo('belentani')} />
      <HUD current={current} onJump={handleNodeClick} onNavigate={navigate} />
      <LorePanel />
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .ship { transition: none !important; }
        }
      `}</style>
    </div>
  );
}

function Routes({ current }: { current: string }) {
  const { allSystems } = useGalaxyMap();
  const routes = [
    ['belentani', 'judas'],
    ['belentani', 'experience'],
    ['belentani', 'neon'],
    ['judas', 'experience'],
    ['experience', 'neon'],
  ];

  return (
    <>
      {routes.map(([a, b], i) => {
        const A = allSystems.find((s) => s.id === a);
        const B = allSystems.find((s) => s.id === b);
        if (!A || !B) return null;
        const active = a === current || b === current;
        return <Route key={i} from={A.position} to={B.position} active={active} />;
      })}
    </>
  );
}

function Nodes({ current, onNodeClick }: { current: string; onNodeClick: (id: string) => void }) {
  const { allSystems } = useGalaxyMap();
  return (
    <>
      {allSystems.map((system) => (
        <Html key={system.id} position={[(system.position.x - 50) * 1.4, (50 - system.position.y) * 1.4, 0]} center>
        <GalaxyNode
          key={system.id}
          kind={system.kind}
          active={system.id === current}
          name={system.name}
          tag={system.tag}
          color={system.color}
          onClick={() => onNodeClick(system.id)}
        />
        </Html>
      ))}
    </>
  );
}

function handleAction(action: string, url?: string) {
  if (action === 'navigate' && url) {
    const { useGalaxyStore } = require('@/store/galaxy');
    useGalaxyStore.getState().travelTo(url);
  } else if (action === 'chapter' && url) {
    window.location.href = `/judas/${url}`;
  } else if (action === 'external' && url) {
    if (url.startsWith('/')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  }
}
