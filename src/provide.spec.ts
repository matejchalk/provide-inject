import { provide } from './provide';
import { getStore } from './store';
import { InjectionToken } from './token';

describe('provide', () => {
  it('should provide constant with `useValue`', () => {
    const token = new InjectionToken<string>('LOG_LEVEL');

    provide({ token, useValue: 'debug' });

    expect(getStore().getByToken(token)).toEqual({
      type: 'value',
      value: 'debug',
    });
  });

  it('should provide function with `useFactory`', () => {
    const token = new InjectionToken<Console>('LOGGER');
    const createLogger = () => console;

    provide({ token, useFactory: createLogger });

    expect(getStore().getByToken(token)).toEqual({
      type: 'factory',
      factory: createLogger,
    });
  });

  it('should provide class with `useClass`', () => {
    const token = new InjectionToken<Logger>('LOGGER');
    class Logger {}

    provide({ token, useClass: Logger });

    expect(getStore().getByToken(token)).toEqual({
      type: 'class',
      class: Logger,
    });
  });

  it('should provide class using shorthand', () => {
    class Logger {}

    provide(Logger);

    expect(getStore().getByToken(Logger)).toEqual({
      type: 'class',
      class: Logger,
    });
  });

  it('should defer calling factory function', async () => {
    const createLogger = vi.fn();

    provide({ token: new InjectionToken('LOGGER'), useFactory: createLogger });

    expect(createLogger).not.toHaveBeenCalled();
  });

  it('should defer instantiating class', async () => {
    const initFn = vi.fn();
    class Logger {
      constructor() {
        initFn();
      }
    }

    provide(Logger);

    expect(initFn).not.toHaveBeenCalled();
  });
});
