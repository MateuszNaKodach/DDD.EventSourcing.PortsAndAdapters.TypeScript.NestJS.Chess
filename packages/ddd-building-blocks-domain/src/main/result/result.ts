import { AbstractFailureDomainEvent } from "../event/abstract-failure-domain-event";
import { AbstractSuccessDomainEvent } from "../event/abstract-success-domain-event";
import { DomainEvent } from "../event/domain-event";

export abstract class Result<S extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent,
  F extends AbstractFailureDomainEvent = AbstractFailureDomainEvent> {
  static success<S extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent>(events: undefined | S | S[] = undefined): Success<S> {
    return events === undefined
      ? Success.empty<S>()
      : Array.isArray(events)
        ? Success.many<S>(events)
        : Success.single<S>(events);
  }

  static failure<F extends AbstractFailureDomainEvent = AbstractFailureDomainEvent>(event: F): Failure<F> {
    return new Failure<F>(event);
  }

  abstract failureReason(): string | undefined;

  abstract get events(): (S | F)[];

  isSuccess(): boolean {
    return this.failureReason() === undefined;
  }

  isFailure(): boolean {
    return !this.isSuccess();
  }

  handleEvents(handler: (event: DomainEvent) => unknown): void {
    this.events.map(it => it as DomainEvent).forEach(handler);
  }
}

export class Success<S extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent> extends Result<S> {
  private readonly _events: S[];

  private constructor(events: S[]) {
    super();
    this._events = events;
  }

  static empty<S extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent>(): Success<S> {
    return new Success<S>([]);
  }

  get events(): S[] {
    return [...this._events];
  }

  static many<S extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent>(events: S[]): Success<S> {
    return new Success<S>([...events]);
  }

  static single<S extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent>(event: S): Success<S> {
    return new Success<S>([event]);
  }

  failureReason(): undefined {
    return undefined;
  }

  also<S2 extends AbstractSuccessDomainEvent = AbstractSuccessDomainEvent>(anotherSuccess: Success<S2>): Success<S | S2> {
    if (!anotherSuccess.isSuccess()) {
      throw new Error("Cannot concat result which is success and failure at the same time!");
    }
    return new Success<S | S2>([...this.events, ...anotherSuccess.events]);
  }
}

export class Failure<F extends AbstractFailureDomainEvent = AbstractFailureDomainEvent> extends Result<F> {
  private readonly reason: F;

  constructor(reason: F) {
    super();
    this.reason = reason;
  }

  failureReason(): string {
    return this.reason.data.reason;
  }

  get events(): F[] {
    return [this.reason];
  }
}
