import { isTouchDevice } from './isTouchDevice';
import { Key, KeyConfig } from './Key';

export type KeyboardConfig = KeyConfig[];

export class Keyboard {
  constructor(config: KeyboardConfig, container: Element) {
    config.forEach((keyConfig) => new Key(keyConfig, container).initEventListeners());

    if (!isTouchDevice()) {
      container.classList.add('show-hint');
    }
  }
}
