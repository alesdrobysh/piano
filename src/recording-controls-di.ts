import { div, button } from './dom';
import { EventEmitter } from './event-emitter';
import { Events } from './recording-service';

type LoopState = {
  isRecording: boolean;
  isPlaying: boolean;
  hasLoop: boolean;
};

export const recordingControls = (eventBus: EventEmitter) => {
  const loopButton = button('Start Loop').class('loop-btn');
  let currentState: LoopState = { isRecording: false, isPlaying: false, hasLoop: false };

  const updateUI = (state: LoopState) => {
    currentState = state;
    if (state.isRecording) {
      loopButton.element!.textContent = 'Stop Recording';
      loopButton.element!.className = 'loop-btn stop-btn';
    } else if (state.isPlaying) {
      loopButton.element!.textContent = 'Clear Loop';
      loopButton.element!.className = 'loop-btn clear-btn';
    } else if (state.hasLoop) {
      loopButton.element!.textContent = 'Start Loop';
      loopButton.element!.className = 'loop-btn start-btn';
    } else {
      loopButton.element!.textContent = 'Start Loop';
      loopButton.element!.className = 'loop-btn start-btn';
    }
  };

  const handleLoopAction = () => {
    if (currentState.isRecording) {
      eventBus.emit<void>(Events.LOOP_STOP);
    } else if (currentState.isPlaying) {
      eventBus.emit<void>(Events.LOOP_CLEAR);
    } else {
      eventBus.emit<void>(Events.LOOP_START);
    }
  };

  loopButton.listen('click', handleLoopAction);

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      handleLoopAction();
    }
  });

  eventBus.on<LoopState>(Events.STATE_CHANGED, (state) => {
    if (state) updateUI(state);
  });

  return div([div([loopButton]).class('record-section')]).class('recording-controls');
};
