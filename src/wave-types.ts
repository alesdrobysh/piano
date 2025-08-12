export const WaveTypes = {
  SINE: 'sine',
  SQUARE: 'square',
  SAWTOOTH: 'sawtooth',
  TRIANGLE: 'triangle',
} as const;

export type WaveType = (typeof WaveTypes)[keyof typeof WaveTypes];

export interface WaveTypeOption {
  value: WaveType;
  label: string;
}

export const WAVE_TYPE_OPTIONS: WaveTypeOption[] = [
  { value: WaveTypes.SINE, label: 'Sine Wave' },
  { value: WaveTypes.SQUARE, label: 'Square Wave' },
  { value: WaveTypes.SAWTOOTH, label: 'Sawtooth Wave' },
  { value: WaveTypes.TRIANGLE, label: 'Triangle Wave' },
];
