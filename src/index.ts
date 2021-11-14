import { Keyboard, KeyboardConfig } from './Keyboard';

const container = document.querySelector('.keyboard');

if (!container) {
  throw new Error('Keyboard container was not found');
}

const config: KeyboardConfig = [
  { name: 'C4', frequency: 261.63, hint: 'a' },
  { name: 'C#4', frequency: 277.18, hint: 'w' },
  { name: 'D4', frequency: 293.66, hint: 's' },
  { name: 'D#4', frequency: 311.13, hint: 'e' },
  { name: 'E4', frequency: 329.63, hint: 'd' },
  { name: 'F4', frequency: 349.23, hint: 'f' },
  { name: 'F#4', frequency: 369.99, hint: 't' },
  { name: 'G4', frequency: 392, hint: 'g' },
  { name: 'G#4', frequency: 415.3, hint: 'y' },
  { name: 'A4', frequency: 440, hint: 'h' },
  { name: 'A#4', frequency: 466.16, hint: 'u' },
  { name: 'B4', frequency: 493.88, hint: 'j' },
  { name: 'C5', frequency: 523.25, hint: 'k' },
  { name: 'C#5', frequency: 554.37, hint: 'o' },
  { name: 'D5', frequency: 587.33, hint: 'l' },
  { name: 'D#5', frequency: 622.25, hint: 'p' },
  { name: 'E5', frequency: 659.26, hint: ';' },
  { name: 'F5', frequency: 698.46, hint: "'" },
  { name: 'F#5', frequency: 739.99, hint: ']' },
  { name: 'G5', frequency: 783.99, hint: '\\' },
];

new Keyboard(config, container);
