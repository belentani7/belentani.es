import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JarvisContext = 'judas' | 'biblia' | 'qwen' | 'system';

export interface JarvisMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type JarvisCommand =
  | 'scan'
  | 'tarot'
  | 'dream'
  | 'forge'
  | 'detect'
  | 'write'
  | 'help'
  | 'clear'
  | 'context:judas'
  | 'context:biblia'
  | 'context:qwen';

export interface JarvisState {
  /** Whether the Jarvis assistant panel is open */
  isOpen: boolean;
  /** Whether the panel is minimized to just the avatar trigger */
  isMinimized: boolean;
  /** Current conversation context used for AI system prompt */
  context: JarvisContext;
  /** Conversation history */
  messages: JarvisMessage[];
  /** Whether a streaming response is in progress */
  isStreaming: boolean;
  /** Whether the user has dismissed Jarvis permanently for this session */
  dismissed: boolean;

  open: () => void;
  close: () => void;
  toggle: () => void;
  minimize: () => void;
  maximize: () => void;
  setContext: (ctx: JarvisContext) => void;
  addMessage: (msg: Omit<JarvisMessage, 'id' | 'timestamp'>) => void;
  appendToLast: (text: string) => void;
  clearMessages: () => void;
  startStreaming: () => void;
  stopStreaming: () => void;
  dismiss: () => void;
  restore: () => void;
}

const initialSystemMessage: JarvisMessage = {
  id: 'system-intro',
  role: 'assistant',
  content:
    'Iniciando JUDAS_OS v3.0 — núcleo cognitivo en línea.\n\nSoy Jarvis, tu asistente dentro del Experience Core. Puedes consultarme sobre el lore de JUDAS, la Biblia de la Música, o el análisis Qwen.\n\nComandos: SCAN · TAROT · DREAM · FORGE · DETECT · WRITE · HELP',
  timestamp: 0,
};

export const useJarvisStore = create<JarvisState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isMinimized: false,
      context: 'judas',
      messages: [initialSystemMessage],
      isStreaming: false,
      dismissed: false,

      open: () => set({ isOpen: true, isMinimized: false }),
      close: () => set({ isOpen: false, isMinimized: false }),
      toggle: () => {
        const { isOpen } = get();
        if (isOpen) {
          set({ isOpen: false, isMinimized: false });
        } else {
          set({ isOpen: true, isMinimized: false, dismissed: false });
        }
      },
      minimize: () => set({ isMinimized: true }),
      maximize: () => set({ isMinimized: false, isOpen: true }),
      setContext: (ctx) => set({ context: ctx }),
      addMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages,
            {
              ...msg,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
          ],
        })),
      appendToLast: (text) =>
        set((s) => {
          const msgs = [...s.messages];
          const last = msgs[msgs.length - 1];
          if (last && last.role === 'assistant') {
            last.content += text;
          } else {
            msgs.push({
              id: crypto.randomUUID(),
              role: 'assistant',
              content: text,
              timestamp: Date.now(),
            });
          }
          return { messages: msgs };
        }),
      clearMessages: () => set({ messages: [initialSystemMessage] }),
      startStreaming: () => set({ isStreaming: true }),
      stopStreaming: () => set({ isStreaming: false }),
      dismiss: () => set({ isOpen: false, isMinimized: false, dismissed: true }),
      restore: () => set({ isOpen: true, isMinimized: false, dismissed: false }),
    }),
    {
      name: 'belentani-jarvis',
      partialize: (state) => ({
        context: state.context,
        messages: state.messages,
        dismissed: state.dismissed,
      }),
    }
  )
);
