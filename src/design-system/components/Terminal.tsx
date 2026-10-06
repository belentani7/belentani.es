'use client';
import { forwardRef, HTMLAttributes, FormEvent, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'syslog' | 'input' | 'quick-commands';
  lines?: string[];
  onCommand?: (cmd: string) => void;
}

const BaseTerminal = forwardRef<HTMLDivElement, TerminalProps>(
  ({ className, variant = 'syslog', lines = [], onCommand, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (logRef.current && variant === 'syslog') {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, [lines, variant]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const input = inputRef.current;
      if (input?.value.trim() && onCommand) {
        onCommand(input.value.trim());
        input.value = '';
      }
    };

    if (variant === 'syslog') {
      return (
        <div ref={ref} className={cn('border border-border bg-voidElevated/80 backdrop-blur-md rounded-lg', className)} {...props}>
          <div className="flex items-center gap-2 p-2 border-b border-border text-xs tracking-widest text-red">
            <span className="flex gap-1">
              <i className="w-2 h-2 rounded-full bg-redDim" />
              <i className="w-2 h-2 rounded-full bg-red" style={{ boxShadow: '0 0 8px #ff073a' }} />
              <i className="w-2 h-2 rounded-full bg-goldDim" />
            </span>
            <span>SYSTEM</span>
          </div>
          <div ref={logRef} className="h-[180px] overflow-y-auto p-3 font-mono text-sm leading-loose text-mute">
            {lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span className="text-redDim mr-2">[SYS]</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (variant === 'input') {
      return (
        <form onSubmit={handleSubmit} className={cn('flex items-center gap-2 p-2 border-t border-border', className)}>
          <span className="text-red text-lg" style={{ textShadow: '0 0 10px #ff073a' }}>›</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-ink text-base tracking-wide caret-red"
            placeholder="comando..."
            autoComplete="off"
          />
        </form>
      );
    }

    if (variant === 'quick-commands') {
      const quickCommands = ['status', 'jump judas', 'jump experience', 'audio on', 'audio off', 'help'];
      return (
        <div className={cn('flex flex-wrap gap-2 p-2 border-t border-red/14', className)} {...props}>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => onCommand?.(cmd)}
              className="qc border border-red/22 text-mute px-3 py-1.5 text-xs tracking-wider hover:border-red hover:text-red hover:shadow-[0_0_12px_rgba(255,7,58,.3)] transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      );
    }

    return null;
  }
);

export const Terminal = BaseTerminal;
Terminal.displayName = 'Terminal';