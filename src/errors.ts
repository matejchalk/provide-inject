import { InjectionToken, type Token } from './token';

export class MissingProviderError extends Error {
  constructor(token: Token) {
    const name =
      token instanceof InjectionToken
        ? token.toString()
        : `class ${token.name}`;
    super(`No provider for ${name}`);
  }
}
