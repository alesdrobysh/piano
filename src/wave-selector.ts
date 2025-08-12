import { EventEmitter } from './event-emitter';
import { div, select, option } from './dom';
import { Sound } from './sound';
import { WAVE_TYPE_OPTIONS, WaveType } from './wave-types';

export const Events = {
  WAVE_TYPE_CHANGED: 'wave:type:changed'
} as const;

export interface WaveTypeChangedEvent {
  waveType: WaveType;
}

export const waveSelector = (eventBus: EventEmitter) => {
  const handleWaveChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const waveType = target.value as WaveType;
    
    Sound.setWaveType(waveType);
    eventBus.emit<WaveTypeChangedEvent>(Events.WAVE_TYPE_CHANGED, { waveType });
  };

  const currentWaveType = Sound.getWaveType();
  
  const options = WAVE_TYPE_OPTIONS.map(waveOption => {
    const opt = option(waveOption.label).attribute('value', waveOption.value);
    if (waveOption.value === currentWaveType) {
      opt.attribute('selected', 'selected');
    }
    return opt;
  });

  const selectElement = select(options)
    .class('wave-selector')
    .listen('change', handleWaveChange);

  return div([selectElement])
    .class('wave-selector-container');
};