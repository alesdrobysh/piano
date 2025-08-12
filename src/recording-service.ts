import { EventEmitter } from './event-emitter';

export type RecordingEvent = {
  type: 'start' | 'stop';
  note: string;
  frequency: number;
  timestamp: number;
};

export type Recording = {
  id: string;
  name: string;
  events: RecordingEvent[];
  duration: number;
  createdAt: number;
};

export const Events = {
  LOOP_START: 'loop:start',
  LOOP_STOP: 'loop:stop',
  LOOP_CLEAR: 'loop:clear',
  NOTE_PRESSED: 'note:pressed',
  NOTE_RELEASED: 'note:released',
  PLAYBACK_NOTE_PRESSED: 'playback:notePressed',
  PLAYBACK_NOTE_RELEASED: 'playback:noteReleased',
  STATE_CHANGED: 'state:changed'
} as const;

export type NoteEvent = {
  note: string;
  frequency: number;
};

export class RecordingService {
  private isRecording = false;
  private isPlaying = false;
  private currentLoop: RecordingEvent[] = [];
  private recordingStartTime = 0;
  private playbackTimeouts: number[] = [];

  constructor(private eventBus: EventEmitter) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.on<void>(Events.LOOP_START, () => {
      this.startLoop();
    });

    this.eventBus.on<void>(Events.LOOP_STOP, () => {
      this.stopLoop();
    });

    this.eventBus.on<void>(Events.LOOP_CLEAR, () => {
      this.clearLoop();
    });

    this.eventBus.on<NoteEvent>(Events.NOTE_PRESSED, (data) => {
      if (data) this.recordNoteEvent('start', data.note, data.frequency);
    });

    this.eventBus.on<NoteEvent>(Events.NOTE_RELEASED, (data) => {
      if (data) this.recordNoteEvent('stop', data.note, data.frequency);
    });
  }

  private recordNoteEvent(type: 'start' | 'stop', note: string, frequency: number): void {
    if (!this.isRecording) return;
    
    const timestamp = performance.now() - this.recordingStartTime;
    this.currentLoop.push({ type, note, frequency, timestamp });
  }

  private startLoop(): void {
    if (this.isRecording || this.isPlaying) return;
    
    this.isRecording = true;
    this.currentLoop = [];
    this.recordingStartTime = performance.now();
    this.emitStateChange();
  }

  private stopLoop(): void {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    if (this.currentLoop.length > 0) {
      this.playLoop();
    }
    this.emitStateChange();
  }

  private clearLoop(): void {
    this.stopPlayback();
    this.currentLoop = [];
    this.emitStateChange();
  }

  private playLoop(): void {
    if (this.currentLoop.length === 0) return;
    
    this.isPlaying = true;
    this.emitStateChange();
    
    const duration = Math.max(...this.currentLoop.map(e => e.timestamp));
    
    const scheduleEvents = () => {
      this.playbackTimeouts = [];
      
      this.currentLoop.forEach(event => {
        const timeoutId = setTimeout(() => {
          if (!this.isPlaying) return;
          
          if (event.type === 'start') {
            this.eventBus.emit<NoteEvent>(Events.PLAYBACK_NOTE_PRESSED, {
              note: event.note,
              frequency: event.frequency
            });
          } else {
            this.eventBus.emit<NoteEvent>(Events.PLAYBACK_NOTE_RELEASED, {
              note: event.note,
              frequency: event.frequency
            });
          }
        }, event.timestamp);
        
        this.playbackTimeouts.push(timeoutId);
      });

      const endTimeoutId = setTimeout(() => {
        if (this.isPlaying) {
          scheduleEvents();
        }
      }, duration + 100);
      
      this.playbackTimeouts.push(endTimeoutId);
    };

    scheduleEvents();
  }

  private stopPlayback(): void {
    if (!this.isPlaying) return;
    
    this.playbackTimeouts.forEach(clearTimeout);
    this.playbackTimeouts = [];
    this.isPlaying = false;
    this.emitStateChange();
  }

  getState() {
    return {
      isRecording: this.isRecording,
      isPlaying: this.isPlaying,
      hasLoop: this.currentLoop.length > 0
    };
  }

  private emitStateChange(): void {
    this.eventBus.emit(Events.STATE_CHANGED, this.getState());
  }
}