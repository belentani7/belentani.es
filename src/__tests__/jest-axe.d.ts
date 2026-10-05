declare module 'jest-axe' {
  export interface AxeResults {
    violations: unknown[];
    passes: unknown[];
    incomplete: unknown[];
    inapplicable: unknown[];
  }

  export function axe(
    context?: unknown,
    options?: unknown,
    config?: unknown,
  ): Promise<AxeResults>;

  export function configureAxe(options: unknown): void;

  export const toHaveNoViolations: {
    [matcherName: string]: (
      this: { isNot?: boolean },
      received: AxeResults,
      ...rest: unknown[]
    ) => { pass: boolean; message: () => string };
  };
}