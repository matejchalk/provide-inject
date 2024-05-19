import type { Class, Token } from './token';

let store: Store;

export function getStore(): Store {
  store ??= new Store();
  return store;
}

export class Store {
  readonly #values = new Map<Token, unknown>();
  readonly #factories = new Map<Token, () => unknown>();
  readonly #classes = new Map<Token, Class>();

  setValue(token: Token, value: unknown): void {
    this.#values.set(token, value);
    this.#classes.delete(token);
    this.#factories.delete(token);
  }

  setFactory(token: Token, factory: () => unknown): void {
    this.#factories.set(token, factory);
    this.#classes.delete(token);
    this.#values.delete(token);
  }

  setClass(token: Token, klass: Class): void {
    this.#classes.set(token, klass);
    this.#factories.delete(token);
    this.#values.delete(token);
  }

  getByToken(token: Token): StoreEntry | null {
    if (this.#values.has(token)) {
      return { type: 'value', value: this.#values.get(token) };
    }

    const factory = this.#factories.get(token);
    if (factory != null) {
      return { type: 'factory', factory };
    }

    const klass = this.#classes.get(token);
    if (klass != null) {
      return { type: 'class', class: klass };
    }

    return null;
  }
}

type StoreValueEntry = { type: 'value'; value: unknown };
type StoreFactoryEntry = { type: 'factory'; factory: () => unknown };
type StoreClassEntry = { type: 'class'; class: Class };
type StoreEntry = StoreValueEntry | StoreFactoryEntry | StoreClassEntry;
