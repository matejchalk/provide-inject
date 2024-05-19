import { CircularDependencyError } from './errors';
import type { Token } from './token';

let stack: Token[] = [];

export function detectCycles<T>(token: Token, factory: () => T): T {
  if (stack.includes(token)) {
    const tokens = [...stack, token];
    stack = [];
    throw new CircularDependencyError(tokens);
  }

  stack.push(token);
  const value = factory();
  stack.pop();

  return value;
}
