type EventCallback<T = unknown> = (data: T) => void;

export class EventEmitter {
  private events: Record<string, EventCallback[]> = {};

  on<T = unknown>(events: string | string[], callback: EventCallback<T>) {
    const register = (event: string) => {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback as EventCallback);
    };

    if (Array.isArray(events)) {
      events.forEach(register);
    } else {
      register(events);
    }
  }

  off<T = unknown>(event: string, callback: EventCallback<T>) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }

  emit<T = unknown>(event: string, data?: T) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  clear() {
    this.events = {};
  }
}