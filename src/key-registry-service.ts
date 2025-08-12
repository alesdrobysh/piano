import { EventEmitter } from './event-emitter';
import { Events, NoteEvent } from './recording-service';
import { KeyElement } from './key';

export class KeyRegistryService {
  private keys = new Map<string, KeyElement>();

  constructor(private eventBus: EventEmitter) {
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.eventBus.on<NoteEvent>(Events.PLAYBACK_NOTE_PRESSED, (data) => {
      if (data) this.playNoteByName(data.note);
    });

    this.eventBus.on<NoteEvent>(Events.PLAYBACK_NOTE_RELEASED, (data) => {
      if (data) this.stopNoteByName(data.note);
    });
  }

  register(keyElement: KeyElement): void {
    this.keys.set(keyElement.config.name, keyElement);
  }

  private playNoteByName(noteName: string): void {
    const keyElement = this.keys.get(noteName);
    if (keyElement) {
      keyElement.playNote();
    }
  }

  private stopNoteByName(noteName: string): void {
    const keyElement = this.keys.get(noteName);
    if (keyElement) {
      keyElement.stopNote();
    }
  }
}