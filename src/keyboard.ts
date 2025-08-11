import { isTouchDevice } from './is-touch-device';
import { key, KeyConfig } from './key';
import { div } from './dom';

export type KeyboardConfig = KeyConfig[];

export const keyboard = (config: KeyboardConfig) => {
  const classes = isTouchDevice() ? 'keyboard' : 'keyboard show-hint';

  const keys = config.map(key);

  return div(keys).class(classes);
};
