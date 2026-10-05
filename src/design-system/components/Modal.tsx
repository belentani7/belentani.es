'use client';
import { Fragment, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui';

interface ModalProps {
  children: ReactNode;
  variant?: 'default' | 'terminal' | 'tarot' | 'forge';
  onClose: () => void;
}

export function Modal({ children, variant = 'default', onClose }: ModalProps) {
  const isOpen = useUIStore((s) => s.modalOpen);
  if (!isOpen) return null;

  const base = 'fixed inset-0 z-[200] flex items-start justify-center p-4vh px-4 overflow-y-auto';
  const backdrop = 'fixed inset-0 bg-void/78 backdrop-blur-sm';
  const panel = 'relative w-full max-w-[860px] min-h-[300px] border border-red bg-gradient-to-b from-voidElevated/97 to-void/97 shadow-[0_0_70px_rgba(255,7,58,.35)]';
  const variants = {
    default: '',
    terminal: 'font-mono',
    tarot: 'perspective-900',
    forge: 'font-mono',
  };

  return createPortal(
    <Fragment>
      <div className={backdrop} onClick={onClose} aria-hidden="true" />
      <div className={base} role="dialog" aria-modal="true">
        <div className={cn(panel, variants[variant])}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="font-display tracking-wide text-ink text-lg">{useUIStore.getState().modalContent?.type || 'Modal'}</h2>
              <p className="text-xs text-red tracking-widest uppercase mt-1">{useUIStore.getState().modalContent?.subtitle || ''}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 border border-border text-red hover:bg-red hover:text-void transition-all" aria-label="Cerrar">×</button>
          </div>
          <div className="p-5 lg:p-7 text-base leading-relaxed">{children}</div>
        </div>
      </div>
    </Fragment>,
    document.body
  );
}