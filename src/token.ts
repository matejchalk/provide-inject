export class InjectionToken<T> {
  readonly #description: string;

  constructor(description: string) {
    this.#description = description;
  }

  toString() {
    return `InjectionToken(${this.#description})`;
  }
}

export type Class<T = unknown, P extends any[] = []> = {
  new (...args: P): T;
};

export type Token<T = unknown> = Class<T> | InjectionToken<T>;
