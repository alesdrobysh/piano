import { isTouchDevice } from './is-touch-device';
import { key, KeyConfig } from './key';
import { div } from './dom';
import { EventEmitter } from './event-emitter';
import { KeyRegistryService } from './key-registry-service';

export type KeyboardConfig = KeyConfig[];

export const keyboard = (eventBus: EventEmitter, keyRegistry: KeyRegistryService, config: KeyboardConfig) => {
  const classes = isTouchDevice() ? 'keyboard' : 'keyboard show-hint';

  const keys = config.map(keyConfig => key(eventBus, keyRegistry, keyConfig));

  return div(keys).class(classes);
};
