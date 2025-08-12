type ServiceFactory<T = unknown> = (...deps: unknown[]) => T;
type ServiceInstance<T = unknown> = T;

interface ServiceDefinition<T = unknown> {
  factory: ServiceFactory<T> | ServiceInstance<T>;
  dependencies: readonly string[];
  singleton: boolean;
  instance?: T;
}

interface ServiceDescriptor<T = unknown> {
  factory?: ServiceFactory<T> | ServiceInstance<T>;
  dependencies?: readonly string[];
  singleton?: boolean;
}

class DIContainer {
  private services = new Map<string, ServiceDefinition>();

  instance<T>(name: string, instance: T): void {
    this.register(name, { factory: instance, singleton: true });
  }

  factory<T>(
    name: string, 
    factory: (...deps: unknown[]) => T, 
    dependencies: readonly string[] = [],
    singleton: boolean = true
  ): void {
    this.register(name, { factory: factory as ServiceFactory<T>, dependencies, singleton });
  }

  register<T>(name: string, descriptor: ServiceDescriptor<T>): void {
    if (this.services.has(name)) {
      throw new Error(`Service ${name} is already registered`);
    }

    if (!descriptor.factory) {
      throw new Error(`Service ${name} must have a factory or instance`);
    }
    
    const definition: ServiceDefinition<T> = {
      factory: descriptor.factory,
      dependencies: descriptor.dependencies ?? [],
      singleton: descriptor.singleton ?? true
    };
    
    this.services.set(name, definition);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} is not registered`);
    }

    if (service.singleton && service.instance !== undefined) {
      return service.instance as T;
    }

    let instance: T;
    if (typeof service.factory === 'function') {
      const resolvedDependencies = service.dependencies.map((dep) => this.resolve(dep));
      const factory = service.factory as ServiceFactory<T>;
      instance = factory(...resolvedDependencies);
    } else {
      instance = service.factory as T;
    }

    if (service.singleton) {
      service.instance = instance;
    }

    return instance;
  }

  createFactory<T>(name: string): ServiceFactory<T> {
    return (...args: unknown[]) => {
      const resolvedService = this.resolve<ServiceFactory<T>>(name);
      return resolvedService(...args);
    };
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  clear(): void {
    this.services.clear();
  }

  service<T>(name: string): ServiceBuilder<T> {
    return new ServiceBuilder<T>(name, this);
  }
}

class ServiceBuilder<T> {
  private descriptor: ServiceDescriptor<T> = {};

  constructor(
    private name: string, 
    private container: DIContainer
  ) {}

  factory(factoryFn: (...deps: unknown[]) => T): this {
    this.descriptor.factory = factoryFn as ServiceFactory<T>;
    return this;
  }

  instance(instance: T): this {
    this.descriptor.factory = instance;
    this.descriptor.singleton = true;
    return this;
  }

  depends(...dependencies: string[]): this {
    this.descriptor.dependencies = dependencies;
    return this;
  }

  singleton(isSingleton: boolean = true): this {
    this.descriptor.singleton = isSingleton;
    return this;
  }

  transient(): this {
    return this.singleton(false);
  }

  register(): void {
    this.container.register(this.name, this.descriptor);
  }
}

export const di = new DIContainer();

function singletonService<T>(name: string, factory: ((...deps: unknown[]) => T), ...dependencies: string[]) {
  return di.register<T>(name, { 
    factory, 
    dependencies, 
    singleton: true 
  });
}

function transientService<T>(name: string, factory: ((...deps: unknown[]) => T), ...dependencies: string[]) {
  return di.register<T>(name, { 
    factory, 
    dependencies, 
    singleton: false 
  });
}
import { EventEmitter } from './event-emitter';
import { RecordingService } from './recording-service';
import { KeyRegistryService } from './key-registry-service';
import { keyboard, KeyboardConfig } from './keyboard';
import { recordingControls } from './recording-controls-di';
import { UiElement } from './dom';
const serviceConfig = [
  {
    name: 'eventBus',
    instance: new EventEmitter(),
  },
  {
    name: 'recordingService',
    factory: (eventBus: EventEmitter) => new RecordingService(eventBus),
    dependencies: ['eventBus']
  },
  {
    name: 'keyRegistry', 
    factory: (eventBus: EventEmitter) => new KeyRegistryService(eventBus),
    dependencies: ['eventBus']
  },
  {
    name: 'keyboardFactory',
    factory: (eventBus: EventEmitter, keyRegistry: KeyRegistryService) => 
      (config: KeyboardConfig) => keyboard(eventBus, keyRegistry, config),
    dependencies: ['eventBus', 'keyRegistry'],
    singleton: false
  },
  {
    name: 'recordingControlsFactory',
    factory: (eventBus: EventEmitter) => () => recordingControls(eventBus),
    dependencies: ['eventBus'],
    singleton: false
  }
] as const;
serviceConfig.forEach(config => {
  if ('instance' in config) {
    di.instance(config.name, config.instance);
  } else {
    const factory = config.factory as (...deps: unknown[]) => unknown;
    const singleton = 'singleton' in config ? config.singleton : true;
    
    if (singleton) {
      singletonService(config.name, factory, ...config.dependencies);
    } else {
      transientService(config.name, factory, ...config.dependencies);
    }
  }
});
