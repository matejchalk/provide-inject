import { getStore } from './store';
import type { Class, Token } from './token';

type ValueProvider<T> = { token: Token<T>; useValue: T };
type FactoryProvider<T> = { token: Token<T>; useFactory: () => T };
type ClassProvider<T> = { token: Token<T>; useClass: Class<T> };
type Provider<T> = ValueProvider<T> | FactoryProvider<T> | ClassProvider<T>;

export function provide<T>(provider: Provider<T>): void;
export function provide<T>(klass: Class<T>): void;

export function provide<T>(provider: Provider<T> | Class<T>): void {
  const store = getStore();

  if ('token' in provider) {
    if ('useValue' in provider) {
      store.setValue(provider.token, provider.useValue);
    }
    if ('useFactory' in provider) {
      store.setFactory(provider.token, provider.useFactory);
    }
    if ('useClass' in provider) {
      store.setClass(provider.token, provider.useClass);
    }
  } else {
    store.setClass(provider, provider);
  }
}
