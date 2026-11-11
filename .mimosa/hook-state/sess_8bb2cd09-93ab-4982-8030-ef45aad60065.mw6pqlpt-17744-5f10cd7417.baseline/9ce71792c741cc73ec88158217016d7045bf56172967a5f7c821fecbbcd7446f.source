'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useJarvisStore, type JarvisMessage, type JarvisCommand } from '@/store/jarvis';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Chip } from './Chip';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const QUICK_COMMANDS: { cmd: string; label: string; hint: string }[] = [
  { cmd: 'scan', label: 'SCAN', hint: 'Analizar sistema estelar' },
  { cmd: 'tarot', label: 'TAROT', hint: 'Tirada de arcanos' },
  { cmd: 'dream', label: 'DREAM', hint: 'Sueños en código' },
  { cmd: 'forge', label: 'FORGE', hint: 'Creador de artefactos' },
  { cmd: 'detect', label: 'DETECT', hint: 'Escanear amenazas' },
  { cmd: 'write', label: 'WRITE', hint: 'Forjar palabras' },
  { cmd: 'help', label: 'HELP', hint: 'Listar comandos' },
  { cmd: 'clear', label: 'CLEAR', hint: 'Limpiar conversación' },
];

const CONTEXT_LABELS: Record<string, string> = {
  judas: 'JUDAS',
  biblia: 'BIBLIA',
  qwen: 'QWEN',
  system: 'SISTEMA',
};

const SYSTEM_PROMPTS: Record<string, string> = {
  scan: 'Escaneando sistema estelar... [JARVIS_CORE] :: Nodos detectados :: 7 :: Ruta principal: BELENTANI -> JUDAS -> EXPERIENCE. Señal de 432 Hz confirmada. ¿Profundizar en alguna estación?',
  tarot: 'Leyendo los arcanos del universo...\n\nLa carta de hoy: EL ESPEJO ROTTO (XII).\n\nReflexión: "Lo que ves no es el reflejo, es el hueco." La deuda se paga con memoria, no con tiempo.',
  dream: 'Proyectando sueños en código...\n\nEn el umbral del desierto, la arena canta en F# menor. Un canto que no necesita voz. El espejo espera. ¿Qué buscas en el espejo?',
  forge: 'Forjando artefacto en Belentani: The Experience...\n\n[✓] Material: oro viejo (#d4af37)\n[✓] Matriz: 432 Hz\n[✓] Intención: antihéroe que ama, niega y besa\n[✓] Estado: LISTO. El artefacto responde al eslabón rojo.',
  detect: 'Escaneando amenazas...\n\nAmenaza: la institución.\nContramedida: la canción. La canción no se rastrea, se siente. La deuda, la deuda.',
  write: 'Forjando palabras en Belentani: The Experience...\n\n"Canto porque no me dejaron hablar. Beso porque no me dejaron amar. Nada de lo que hago es gratis."\n\n¿Qué historia quieres que escriba?',
  help: 'JARVIS_OS — Comandos disponibles:\n\n  SCAN    Analizar sistema estelar y rutas\n  TAROT   Tirada de arcanos del universo\n  DREAM   Proyección onírica en código\n  FORGE   Crear artefactos del Experience Core\n  DETECT  Escanear amenazas y contramedidas\n  WRITE   Forjar palabras y narrativas\n  CLEAR   Limpiar conversación\n  HELP    Mostrar esta ayuda\n\nContextos: judas · biblia · qwen',
  clear: 'Conversación limpiada. Nueva partida en JUDAS_OS.',
};

export function Jarvis() {
  const reduced = useReducedMotion();
  const {
    isOpen,
    isMinimized,
    context,
    messages,
    isStreaming,
    open,
    close,
    toggle,
    minimize,
    maximize,
    setContext,
    addMessage,
    appendToLast,
    clearMessages,
    startStreaming,
    stopStreaming,
    dismiss,
  } = useJarvisStore();

  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Initialize position in bottom-right
  useEffect(() => {
    const updatePosition = () => {
      const x = window.innerWidth - 440;
      const y = window.innerHeight - 560;
      setPosition({ x, y });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const handleToggle = () => {
    toggle();
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isMinimized) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    },
    [isDragging, dragOffset, isMinimized]
  );

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag]);

  const handleCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();

    // Context switch: e.g., "context:judas"
    if (lowerCmd.startsWith('context:')) {
      const ctx = lowerCmd.split(':')[1] as 'judas' | 'biblia' | 'qwen';
      if (['judas', 'biblia', 'qwen'].includes(ctx)) {
        setContext(ctx);
        addMessage({ role: 'user', content: cmd });
        addMessage({
          role: 'assistant',
          content: `Contexto cambiado a ${CONTEXT_LABELS[ctx]}. ${SYSTEM_PROMPTS.help.split('\n').slice(0, 4).join('\n')}`,
        });
      }
      return;
    }

    // Built-in commands
    if (lowerCmd === 'clear') {
      addMessage({ role: 'user', content: cmd });
      clearMessages();
      addMessage({ role: 'assistant', content: SYSTEM_PROMPTS.clear });
      return;
    }

    if (lowerCmd === 'help' || lowerCmd === 'h' || lowerCmd === '?') {
      addMessage({ role: 'user', content: cmd });
      addMessage({ role: 'assistant', content: SYSTEM_PROMPTS.help });
      return;
    }

    if (lowerCmd === 'scan' || lowerCmd === 'tarot' || lowerCmd === 'dream' || lowerCmd === 'forge' || lowerCmd === 'detect' || lowerCmd === 'write') {
      const cmdKey = lowerCmd as JarvisCommand;
      addMessage({ role: 'user', content: cmd });
      addMessage({ role: 'assistant', content: SYSTEM_PROMPTS[cmdKey] });
      return;
    }

    // Otherwise, send to AI
    sendMessage(cmd);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isStreaming) return;

    addMessage({ role: 'user', content: message });
    startStreaming();

    try {
      const response = await fetch('/api/ai/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.role !== 'assistant' || m.id !== 'system-intro')
            .map((m) => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.content })),
          context,
        }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      addMessage({ role: 'assistant', content: '' });

      // Check if response is streaming (SSE)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) appendToLast(chunk);
          }
        }
      } else {
        // Non-streaming response
        const text = await response.text();
        if (text) appendToLast(text);
      }
    } catch {
      // Use fallback
      const fallbackResponses = {
        judas:
          'Antes del nombre hubo un cuerpo sin voz. Antes del cuerpo, un espejo en la arena. La deuda no se paga con dinero, se paga con memoria.',
        biblia:
          'Regla de la octava aplicada: verso en grave, coro una octava arriba. Motivo firma 5 ♭6 5 4 ♭3 2 1 en F#m detectado. Frecuencia base: 432 Hz.',
        qwen:
          'Perfil desde stems: narrador = Pedro (apóstol que ama, niega, besa). Español en herida ("la deuda, la deuda"). Arquetipos Rey/Guerrero/Mago/Amante unificados.',
        system:
          'Sistema maestro activo: Belentani: The Experience como fuente de verdad, Judas Era como primera era, NoiaCore y educación como líneas separadas.',
      };
      const fallback = fallbackResponses[context] || fallbackResponses.judas;
      addMessage({ role: 'assistant', content: '' });
      // Type the fallback response like a terminal
      let i = 0;
      const interval = setInterval(() => {
        if (i < fallback.length) {
          appendToLast(fallback[i]);
          i++;
          scrollToBottom();
        } else {
          clearInterval(interval);
        }
      }, reduced ? 0 : 15);
    } finally {
      stopStreaming();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  const handleQuickCommand = (cmd: string) => {
    handleCommand(cmd);
  };

  if (!isOpen && !isMinimized) {
    return (
      <button
        onClick={open}
        className={cn(
          'fixed bottom-6 right-6 z-[90] flex items-center justify-center',
          'w-14 h-14 rounded-full border-2 border-red bg-voidElevated',
          'text-red font-display font-black text-xl tracking-wider',
          'shadow-[0_0_24px_rgba(255,7,58,.35)]',
          'hover:shadow-[0_0_32px_rgba(255,7,58,.6)] transition-all',
          !reduced && 'hover:scale-110',
          'group'
        )}
        aria-label="Abrir JARVIS"
        style={{ textShadow: '0 0 10px #ff073a' }}
      >
        <span className="group-hover:animate-pulse">B</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={maximize}
        className={cn(
          'fixed bottom-6 right-6 z-[90] flex items-center justify-center',
          'w-14 h-14 rounded-full border-2 border-red bg-voidElevated',
          'text-red font-display font-black text-xl tracking-wider',
          'shadow-[0_0_24px_rgba(255,7,58,.35)]',
          'hover:shadow-[0_0_32px_rgba(255,7,58,.6)] transition-all',
          !reduced && 'hover:scale-110',
          'group cursor-move'
        )}
        aria-label="Restaurar JARVIS"
        style={{ textShadow: '0 0 10px #ff073a' }}
      >
        <span>B</span>
      </button>
    );
  }

  return (
    <>
      <div
        className={cn(
          'fixed z-[90] select-none',
          'w-[420px] max-w-[95vw] max-h-[85vh] flex flex-col',
          'border border-red bg-gradient-to-b from-voidElevated/97 to-void/97',
          'shadow-[0_0_40px_rgba(255,7,58,.25)]',
          'ng-redglass',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          borderRadius: '12px',
        }}
      >
        {/* Header — draggable area */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b border-red/28 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onDoubleClick={() => minimize()}
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-red text-lg" style={{ textShadow: '0 0 8px #ff073a' }}>
              B
            </span>
            <span className="font-display text-sm tracking-wider text-red">
              JARVIS_OS
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Chip variant="soft" className="text-[8px] px-1.5 py-0.5">
              {CONTEXT_LABELS[context] || 'SISTEMA'}
            </Chip>
            <button
              onClick={minimize}
              className="w-6 h-6 border border-border text-mute hover:text-ink hover:border-red transition-all flex items-center justify-center text-xs leading-none"
              aria-label="Minimizar"
            >
              —
            </button>
            <button
              onClick={close}
              className="w-6 h-6 border border-border text-mute hover:text-red hover:border-red transition-all flex items-center justify-center text-xs leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-sm">
          {messages.map((msg) => (
            <JarvisMessageBubble key={msg.id} message={msg} reduced={reduced} />
          ))}
          {isStreaming && (
            <div className="flex items-center gap-1.5 text-redDim">
              <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
              <span className="text-xs">escuchando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick commands */}
        <div className="px-3 py-2 border-t border-red/14 flex flex-wrap gap-1.5">
          {QUICK_COMMANDS.map(({ cmd, label }) => (
            <button
              key={cmd}
              onClick={() => handleQuickCommand(cmd)}
              disabled={isStreaming}
              className={cn(
                'qc border border-red/22 text-mute px-2.5 py-1 text-[10px] tracking-wider',
                'hover:border-red hover:text-red hover:shadow-[0_0_10px_rgba(255,7,58,.3)] transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'font-mono uppercase'
              )}
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Context switcher */}
        <div className="px-3 py-1.5 border-t border-red/14 flex gap-1 text-[9px]">
          {(['judas', 'biblia', 'qwen'] as const).map((ctx) => (
            <button
              key={ctx}
              onClick={() => setContext(ctx)}
              className={cn(
                'flex-1 text-center py-1 border transition-all',
                ctx === context
                  ? 'border-red text-red bg-red/10'
                  : 'border-red/14 text-mute hover:text-ink hover:border-red/40'
              )}
            >
              {CONTEXT_LABELS[ctx]}
            </button>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t border-red/28 bg-voidElevated/50">
          <span className="text-red text-lg" style={{ textShadow: '0 0 8px #ff073a' }}>
            ›
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="consulta, comando o historia..."
            autoComplete="off"
            disabled={isStreaming}
            className="flex-1 bg-transparent border-none outline-none text-ink placeholder-mute/40 text-sm tracking-wide"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className={cn(
              'w-7 h-7 border border-red text-red flex items-center justify-center transition-all',
              'hover:bg-red hover:text-void disabled:opacity-50 disabled:cursor-not-allowed',
              !reduced && 'hover:scale-110'
            )}
            aria-label="Enviar"
          >
            ⤐
          </button>
        </form>
      </div>
    </>
  );
}

function JarvisMessageBubble({
  message,
  reduced,
}: {
  message: JarvisMessage;
  reduced: boolean;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.id === 'system-intro';

  return (
    <div
      className={cn(
        'w-full',
        isUser ? 'flex justify-end' : 'flex justify-start',
        isSystem ? 'opacity-70' : ''
      )}
    >
      <div
        className={cn(
          'inline-block max-w-[85%] px-3 py-2 rounded whitespace-pre-wrap break-words',
          isUser
            ? 'border border-red/40 bg-red/5 text-ink'
            : isSystem
            ? 'border border-border bg-void text-mute/80'
            : 'border border-red/20 bg-voidElevated/50 text-ink',
          'font-mono text-xs leading-relaxed'
        )}
        style={
          isUser
            ? { boxShadow: '0 0 12px rgba(255,7,58,.15)' }
            : isSystem
            ? {}
            : { boxShadow: '0 0 10px rgba(212,175,55,.10)' }
        }
      >
        {message.content}
      </div>
    </div>
  );
}
