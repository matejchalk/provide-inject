import { inject } from './inject';
import { getStore } from './store';
import { InjectionToken } from './token';

describe('inject', () => {
  it('should inject a provided value', () => {
    const token = new InjectionToken<boolean>('VERBOSE');
    getStore().setValue(token, false);

    expect(inject(token)).toBe(false);
  });

  it('should inject return value of provided factory function', () => {
    const token = new InjectionToken<Console>('LOGGER');
    const createLogger = () => console;
    getStore().setFactory(token, createLogger);

    expect(inject(token)).toBe(console);
  });

  it('should inject instance of provided class', () => {
    class Logger {}
    getStore().setClass(Logger, Logger);

    expect(inject(Logger)).toBeInstanceOf(Logger);
  });

  it('should throw error if token not provided', () => {
    expect(() => inject(new InjectionToken('LOGGER'))).toThrow(
      'No provider for InjectionToken("LOGGER")'
    );
  });

  it('should throw error if class not provided', () => {
    expect(() => inject(class Logger {})).toThrow(
      'No provider for class Logger'
    );
  });

  it('should return default value if specified and provider missing', () => {
    const token = new InjectionToken<boolean>('VERBOSE');
    expect(inject(token, { defaultValue: false })).toBe(false);
  });

  it('should only call factory function on first inject', () => {
    const token = new InjectionToken('LOGGER');
    const createLogger = vi.fn();
    getStore().setFactory(token, createLogger);

    inject(token);
    inject(token);

    expect(createLogger).toHaveBeenCalledTimes(1);
  });

  it('should only call class constructor on first inject', () => {
    const initFn = vi.fn();
    class Logger {
      constructor() {
        initFn();
      }
    }
    getStore().setClass(Logger, Logger);

    inject(Logger);
    inject(Logger);
    inject(Logger);

    expect(initFn).toHaveBeenCalledTimes(1);
  });
});
