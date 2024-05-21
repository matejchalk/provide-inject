# provide-inject

💉 **Dependency injection** made simple.

## Features

- 🤓 nice and simple API - `provide` it, then `inject` it
- 🔌 framework-agnostic, runtime-agnostic
- 👣 lightweight, zero dependencies
- 🏭 supports classes, factory functions and arbitrary values
- 🥱 lazy initialization, `inject` may be called at any time
- 🌲 tree-shakeable providers
- ♻️ detects circular dependencies
- 🛡️ checks and infers provider types

## Installation

Install in the usual way with your package manager. E.g. for NPM:

```sh
npm install provide-inject
```

## Usage

The basic idea is you `provide` an `InjectionToken`, so that you can later `inject` it.

A simple example is providing some global value:

```ts
import { provide, inject, InjectionToken } from 'provide-inject';

// create a dependency injection token with a type and description
const DB_URI_TOKEN = new InjectionToken<string>('DB_URI');

// provide a value during startup
provide({ token: DB_URI_TOKEN, useValue: 'mongodb://localhost:27017' });

// access the provided value at some later point
const uri = inject(DB_URI_TOKEN);
```

Classes can be used in place of injection tokens as a handy shorthand:

```ts
class Logger {
  reportError(error: unknown) {
    // ... some implementation ...
  }
}

provide(Logger);

class UserService {
  readonly logger = inject(Logger);

  signOut() {
    try {
      // ... some implementation ...
    } catch (error) {
      logger.reportError(error);
    }
  }
}
```

Alternatively, using an interface as the injection token makes for looser coupling:

```ts
interface ILogger {
  reportError(error: unknown): void;
}

const LOGGER_TOKEN = new InjectionToken<ILogger>('LOGGER');

class Logger implements ILogger {
  reportError(error: unknown) {
    // ... some implementation ...
  }
}

provide({ token: LOGGER_TOKEN, useClass: Logger });

class UserService {
  readonly logger = inject(LOGGER_TOKEN);

  signOut() {
    try {
      // ... some implementation ...
    } catch (error) {
      logger.reportError(error);
    }
  }
}
```

A non-OOP approach would be to use a factory function:

```ts
type Logger = {
  reportError(error: unknown): void;
};

function createLogger(): Logger {
  return {
    reportError(error) {
      // ... some implementation ...
    },
  };
}

const LOGGER_TOKEN = new InjectionToken<Logger>('LOGGER');

provide({ token: LOGGER_TOKEN, useFactory: createLogger });

function createUserService() {
  const logger = inject(LOGGER);

  return {
    signOut() {
      try {
        // ... some implementation ...
      } catch (error) {
        logger.reportError(error);
      }
    },
  };
}
```
