import { WaveType, WaveTypes } from './wave-types';

type AudioNodeMap = {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
};

export class Sound {
  private static context = new AudioContext();
  private static audios = new Map<number, AudioNodeMap>();
  private static currentWaveType: WaveType = WaveTypes.SINE;

  private decayRate = 0.3;
  private fadeArray = new Float32Array(9);

  constructor(private frequency: number) {
    this.fadeArray[0] = 0.954;
    this.fadeArray[1] = 0.903;
    this.fadeArray[2] = 0.845;
    this.fadeArray[3] = 0.778;
    this.fadeArray[4] = 0.699;
    this.fadeArray[5] = 0.602;
    this.fadeArray[6] = 0.477;
    this.fadeArray[7] = 0.301;
    this.fadeArray[8] = 0;
  }

  play() {
    const { audios, context } = Sound;

    if (audios.has(this.frequency)) {
      return;
    }

    const oscillatorNode = new OscillatorNode(context, {
      frequency: this.frequency,
      type: Sound.currentWaveType,
    });
    const gainNode = new GainNode(context);
    const dynamicsCompressorNode = new DynamicsCompressorNode(context, {
      threshold: -48,
      knee: 0,
    });

    oscillatorNode.connect(gainNode).connect(dynamicsCompressorNode).connect(context.destination);

    oscillatorNode.start(context.currentTime);

    audios.set(this.frequency, { oscillatorNode, gainNode });
  }

  stop() {
    const { audios, context } = Sound;
    const audio = audios.get(this.frequency);

    if (!audio) {
      return;
    }

    const { gainNode, oscillatorNode } = audio;

    gainNode.gain.setValueCurveAtTime(this.fadeArray, context.currentTime, this.decayRate);

    setTimeout(
      () => {
        oscillatorNode.stop(context.currentTime);
      },
      this.decayRate * 1000 + 100,
    );

    audios.delete(this.frequency);
  }

  static setWaveType(waveType: WaveType): void {
    Sound.currentWaveType = waveType;
  }

  static getWaveType(): WaveType {
    return Sound.currentWaveType;
  }
}
