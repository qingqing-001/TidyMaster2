type EventHandler<T = unknown> = (payload?: T) => void;

export class EventManager {
  private static instance: EventManager | null = null;
  private readonly listeners = new Map<string, Set<EventHandler>>();

  public static getInstance(): EventManager {
    if (EventManager.instance === null) {
      EventManager.instance = new EventManager();
    }

    return EventManager.instance;
  }

  public on<T = unknown>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(eventName) ?? new Set<EventHandler>();
    handlers.add(handler as EventHandler);
    this.listeners.set(eventName, handlers);
  }

  public off<T = unknown>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }

    handlers.delete(handler as EventHandler);
    if (handlers.size === 0) {
      this.listeners.delete(eventName);
    }
  }

  public emit<T = unknown>(eventName: string, payload?: T): void {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }

    handlers.forEach((handler) => handler(payload));
  }

  public clear(): void {
    this.listeners.clear();
  }
}
