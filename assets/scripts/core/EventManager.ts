type EventHandler<T = unknown> = (payload?: T) => void;

interface ListenerEntry {
  handler: EventHandler;
  target?: any;
}

export class EventManager {
  private static instance: EventManager | null = null;
  private readonly listeners = new Map<string, Set<ListenerEntry>>();

  public static getInstance(): EventManager {
    if (EventManager.instance === null) {
      EventManager.instance = new EventManager();
    }

    return EventManager.instance;
  }

  public on<T = unknown>(eventName: string, handler: EventHandler<T>, target?: any): void {
    const handlers = this.listeners.get(eventName) ?? new Set<ListenerEntry>();
    handlers.add({ handler: handler as EventHandler, target });
    this.listeners.set(eventName, handlers);
  }

  public off<T = unknown>(eventName: string, handler: EventHandler<T>, target?: any): void {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }

    for (const entry of handlers) {
      if (entry.handler === handler && entry.target === target) {
        handlers.delete(entry);
        break;
      }
    }

    if (handlers.size === 0) {
      this.listeners.delete(eventName);
    }
  }

  public emit<T = unknown>(eventName: string, payload?: T): void {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }

    handlers.forEach((entry) => entry.handler(payload));
  }

  public clear(): void {
    this.listeners.clear();
  }
}
