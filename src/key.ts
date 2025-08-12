import { div, span, UiElement } from './dom';
import { Sound } from './sound';
import { EventEmitter } from './event-emitter';
import { Events, NoteEvent } from './recording-service';
import { KeyRegistryService } from './key-registry-service';

export type KeyConfig = {
  name: string;
  frequency: number;
  hint: string;
};

export interface KeyElement extends UiElement {
  playNote: () => void;
  stopNote: () => void;
  config: KeyConfig;
}

export const key = (eventBus: EventEmitter, keyRegistry: KeyRegistryService, config: KeyConfig) => {
  const sound = new Sound(config.frequency);
  const classes = config.name.includes('#') ? 'key sharp' : 'key';

  const playNote = () => {
    keyElement.element?.classList.add('pressed');
    sound.play();
  };

  const stopNote = () => {
    keyElement.element?.classList.remove('pressed');
    sound.stop();
  };

  const onPlay = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    playNote();
    eventBus.emit<NoteEvent>(Events.NOTE_PRESSED, {
      note: config.name,
      frequency: config.frequency,
    });
  };

  const onStop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    stopNote();
    eventBus.emit<NoteEvent>(Events.NOTE_RELEASED, {
      note: config.name,
      frequency: config.frequency,
    });
  };

  const keyElement = div([span(config.hint).class('hint')])
    .class(classes)
    .attribute('data-note', config.name)
    .listen('mousedown', onPlay)
    .listen('touchstart', onPlay)
    .listen('mouseup', onStop)
    .listen('mouseleave', onStop)
    .listen('touchend', onStop);

  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === config.hint.toLowerCase()) {
      onPlay(event);
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === config.hint.toLowerCase()) {
      onStop(event);
    }
  });

  const keyElementWithMethods = keyElement as KeyElement;
  keyElementWithMethods.playNote = playNote;
  keyElementWithMethods.stopNote = stopNote;
  keyElementWithMethods.config = config;

  keyRegistry.register(keyElementWithMethods);

  return keyElementWithMethods;
};
