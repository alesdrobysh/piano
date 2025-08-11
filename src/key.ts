import { div, span } from './dom';
import { Sound } from './sound';

export type KeyConfig = {
  name: string;
  frequency: number;
  hint: string;
};

export const key = (config: KeyConfig) => {
  const sound = new Sound(config.frequency);
  const classes = config.name.includes('#') ? 'key sharp' : 'key';

  const onPlay = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    keyElement.element?.classList.add('pressed');
    sound.play();
  };

  const onStop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    keyElement.element?.classList.remove('pressed');
    sound.stop();
  };

  const keyElement = div([
    span(config.hint).class('hint')
  ])
    .class(classes)
    .attribute('data-note', config.name)
    .listen('mousedown', onPlay)
    .listen('touchstart', onPlay)
    .listen('mouseup', onStop)
    .listen('mouseleave', onStop)
    .listen('touchend', onStop);

  document.addEventListener('keypress', (event) => {
    if (event.key.toLowerCase() === config.hint.toLowerCase()) {
      onPlay(event);
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === config.hint.toLowerCase()) {
      onStop(event);
    }
  });

  return keyElement;
};