import { InjectionToken, type Token } from './token';

export class MissingProviderError extends Error {
  constructor(token: Token) {
    super(`No provider for ${formatToken(token)}`);
  }
}

export class CircularDependencyError extends Error {
  constructor(tokens: Token[]) {
    super(`Circular dependency: ${tokens.map(formatToken).join(' -> ')}`);
  }
}

function formatToken(token: Token) {
  return token instanceof InjectionToken
    ? token.toString()
    : `class ${token.name}`;
}
