declare module 'jest-axe' {
  export interface JestAxeResults {
    violations: unknown[];
    passes: unknown[];
    incomplete: unknown[];
    inapplicable: unknown[];
  }

  export interface JestAxeOptions {
    [key: string]: unknown;
  }

  export function axe(
    html: Element | string | Node,
    options?: JestAxeOptions
  ): Promise<JestAxeResults>;

  // Matcher bundle passed to `expect.extend(...)`.
  export const toHaveNoViolations: any;
}
