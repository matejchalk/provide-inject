import { InjectionToken, inject, provide } from '.';

describe('Public API', () => {
  it('should inject provided class', () => {
    const initFn = vi.fn();
    class Logger {
      constructor() {
        initFn();
      }
    }

    provide(Logger);

    const logger = inject(Logger);

    expect(logger).toBeInstanceOf(Logger);
    expect(initFn).toHaveBeenCalled();
  });

  it('should inject with factory function', () => {
    const createLogger = vi.fn().mockReturnValue(console);
    const DI_LOGGER = new InjectionToken<typeof console>('LOGGER');

    provide({ token: DI_LOGGER, useFactory: createLogger });

    const logger = inject(DI_LOGGER);

    expect(logger).toBe(console);
    expect(createLogger).toHaveBeenCalled();
  });

  it('should inject provided value', () => {
    const DI_LOG_LEVEL = new InjectionToken<string>('LOG_LEVEL');

    provide({ token: DI_LOG_LEVEL, useValue: 'debug' });

    const level = inject(DI_LOG_LEVEL);

    expect(level).toBe('debug');
  });

  it('should allow providing in non-topological order', () => {
    const DI_LOG_LEVEL = new InjectionToken<string>('LOG_LEVEL');
    const DI_LOGGER = new InjectionToken<typeof console>('LOGGER');
    class AuthService {
      logger = inject(DI_LOGGER);
    }
    function createLogger() {
      const level = inject(DI_LOG_LEVEL);
      return console;
    }

    expect(() => {
      // dependencies are: log level -> logger -> auth service
      // but we don't need to provide it in that order thanks to lazy init
      provide(AuthService);
      provide({ token: DI_LOG_LEVEL, useValue: 'debug' });
      provide({ token: DI_LOGGER, useFactory: createLogger });

      inject(AuthService);
    }).not.toThrowError();
  });

  it('should throw if inject called before provide', () => {
    expect(() => inject(new InjectionToken('VERBOSE'))).toThrow(
      'No provider for InjectionToken("VERBOSE")'
    );
  });

  it('should throw if circular dependency detected', () => {
    class Chicken {
      egg = inject(Egg);
    }
    class Egg {
      chicken = inject(Chicken);
    }

    provide(Chicken);
    provide(Egg);

    expect(() => inject(Egg)).toThrow(
      'Circular dependency: class Egg -> class Chicken -> class Egg'
    );
  });
});
