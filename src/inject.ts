import { MissingProviderError } from './errors';
import { getStore } from './store';
import type { Class, InjectionToken, Token } from './token';

type InjectOptions<T> = {
  defaultValue?: T;
};

export function inject<T>(
  token: InjectionToken<T>,
  options?: InjectOptions<T>
): T;
export function inject<T>(klass: Class<T>, options?: InjectOptions<T>): T;

// TODO: detect cycles
export function inject<T>(token: Token<T>, options: InjectOptions<T> = {}): T {
  const store = getStore();

  const entry = store.getByToken(token);

  if (entry == null) {
    if ('defaultValue' in options) {
      return options.defaultValue!;
    }
    throw new MissingProviderError(token);
  }

  switch (entry.type) {
    case 'value':
      return entry.value as T;

    case 'factory':
      const value = entry.factory();
      store.setValue(token, value);
      return value as T;

    case 'class':
      const object = new entry.class();
      store.setValue(token, object);
      return object as T;
  }
}
