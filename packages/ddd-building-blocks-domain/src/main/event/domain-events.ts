import { DomainEvent } from "./domain-event";

export class DomainEvents<T extends DomainEvent = DomainEvent> {

  private constructor(private readonly _events: T[]) {
  }

  static clean<E extends DomainEvent = DomainEvent>() {
    return new DomainEvents<E>([]);
  }

  append(event: T): DomainEvents<T> {
    return new DomainEvents<T>([...this.toArray(), event])
  }

  forgetLast(correlated = true): DomainEvents<T> {
    let eventsAfter = this.toArray();
    const forgotten = eventsAfter.pop()
    if(forgotten && correlated){
      eventsAfter = eventsAfter.filter(it => it.metadata.correlationId.equals(forgotten.metadata.correlationId))
    }
    return new DomainEvents<T>(eventsAfter)
  }

  toArray(): T[] {
    return [...this._events];
  }

}
