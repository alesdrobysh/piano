type KeyElementConfig = {
  name: string;
  hint: string;
};

export class KeyElement {
  private pressedClassName = 'pressed';
  private element?: Element;

  constructor(private config: KeyElementConfig, private container: Element) {}

  press() {
    this.element?.classList.add(this.pressedClassName);
  }

  release() {
    this.element?.classList.remove(this.pressedClassName);
  }

  get addEventListener() {
    return this.element?.addEventListener.bind(this.element);
  }

  render() {
    const keyContainer = document.createElement('div');
    keyContainer.dataset.note = this.config.name;
    keyContainer.classList.add('key');

    if (this.config.name.includes('#')) {
      keyContainer.classList.add('sharp');
    }

    keyContainer.innerHTML = `<span class="hint">${this.config.hint}</span>`;

    this.container.appendChild(keyContainer);
    this.element = keyContainer;
  }
}
