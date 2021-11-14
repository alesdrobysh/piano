import { KeyElement } from './KeyElement';
import { Sound } from './Sound';

export type KeyConfig = {
  name: string;
  frequency: number;
  hint: string;
};

export class Key {
  private element?: KeyElement;
  private sound?: Sound;

  constructor(private config: KeyConfig, container: Element) {
    let _container = container;

    if (config.name.includes('#')) {
      const flatName = config.name.split('#').join('');
      const flatKeyElement = container.querySelector(`[data-note="${flatName}"]`);
      if (flatKeyElement) {
        _container = flatKeyElement;
      }
    }

    this.element = new KeyElement(config, _container);
    this.sound = new Sound(config.frequency);

    this.element.render();
  }

  private onPlay = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.element?.press();
    this.sound?.play();
  };

  private onStop = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.element?.release();
    this.sound?.stop();
  };

  initEventListeners() {
    this.element?.addEventListener?.('mousedown', this.onPlay);
    this.element?.addEventListener?.('touchstart', this.onPlay);

    this.element?.addEventListener?.('mouseup', this.onStop);
    this.element?.addEventListener?.('mouseleave', this.onStop);
    this.element?.addEventListener?.('touchend', this.onStop);

    document.addEventListener('keypress', (event) => {
      if (event.key.toLowerCase() === this.config.hint.toLowerCase()) {
        this.onPlay(event);
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key.toLowerCase() === this.config.hint.toLowerCase()) {
        this.onStop(event);
      }
    });
  }
}
