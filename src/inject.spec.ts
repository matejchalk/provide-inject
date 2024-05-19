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

  it('should detect direct cycles', () => {
    const token1 = new InjectionToken<typeof factory1>('#1');
    const token2 = new InjectionToken<typeof factory1>('#2');
    function factory1() {
      inject(token2);
    }
    function factory2() {
      inject(token1);
    }
    getStore().setFactory(token1, factory1);
    getStore().setFactory(token2, factory2);

    expect(() => inject(token1)).toThrow(
      'Circular dependency: InjectionToken("#1") -> InjectionToken("#2") -> InjectionToken("#1")'
    );
  });

  it('should detect indirect cycles', () => {
    class A {
      constructor() {
        inject(B);
      }
    }
    class B {
      constructor() {
        inject(C);
      }
    }
    class C {
      constructor() {
        inject(A);
      }
    }
    getStore().setClass(A, A);
    getStore().setClass(B, B);
    getStore().setClass(C, C);

    expect(() => inject(A)).toThrow(
      'Circular dependency: class A -> class B -> class C -> class A'
    );
  });

  it('should detect cycle on self', () => {
    class InfiniteLoop {
      constructor() {
        inject(InfiniteLoop);
      }
    }
    getStore().setClass(InfiniteLoop, InfiniteLoop);

    expect(() => inject(InfiniteLoop)).toThrow(
      'Circular dependency: class InfiniteLoop -> class InfiniteLoop'
    );
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
