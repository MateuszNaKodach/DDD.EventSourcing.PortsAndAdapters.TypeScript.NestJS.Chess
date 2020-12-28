import { DomainEvent } from "../event/domain-event";
import { AggregateId } from "../aggregate/aggregate-id.valueobject";
import { AggregateVersion } from "../aggregate/aggregate-version.valueobject";
import { Result } from "../result/result";
import { AbstractFailureDomainEvent } from "../event/abstract-failure-domain-event";
import { TimeProvider } from "../time/time-provider";

const INTERNAL_EVENTS = Symbol();

export abstract class AbstractMutableAggregateRoot<I extends AggregateId> {
  protected id: I | undefined;
  private readonly [INTERNAL_EVENTS]: DomainEvent[] = [];
  private readonly timeProvider: TimeProvider;
  private _committedVersion = AggregateVersion.new();
  private _currentVersion = AggregateVersion.new();

  protected constructor(timeProvider: TimeProvider) {
    this.timeProvider = timeProvider;
  }

  protected get currentDate(): Date{
    return this.timeProvider.currentDate();
  }

  getUncommittedEvents(): DomainEvent[] {
    return this[INTERNAL_EVENTS];
  }

  clearUncommittedEvents():void {
    this[INTERNAL_EVENTS].length = 0;
  }

  loadFromHistory(history: DomainEvent[]):void {
    history.forEach(event => this.apply(event, true));
  }

  protected applyAll(events: DomainEvent[], isFromHistory = false): void {
    events.forEach(event => this.apply(event, isFromHistory));
  }

  //TODO: Checking for aggregate currentVersion here! Because it can pass wrong command.
  executeCommand(executor: () => Result): Result {
    const result = executor();
    this.applyAll(result.events);
    return result;
  }

  protected apply(event: DomainEvent, isFromHistory = false): void {
    if (!isFromHistory) {
      this[INTERNAL_EVENTS].push(event);
    }
    this._currentVersion = this._currentVersion.increase();
    if (isFromHistory) {
      this._committedVersion = this._committedVersion.increase();
    }
    const handler = this.getEventHandler(event);
    if (!handler && !(event instanceof AbstractFailureDomainEvent)) {
      throw new Error(`Handler for domain event ${event.eventType} not found!`);
    }
    if (handler) {
      handler.call(this, event);
    }
  }

  private getEventHandler(event: DomainEvent): (event: DomainEvent) => void | undefined {
    const handler = `on${this.getEventName(event)}`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this[handler];
  }

  protected getEventName(event: DomainEvent): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }

  get aggregateId(): AggregateId {
    return this.id!;
  }

  get committedVersion(): AggregateVersion {
    return this._committedVersion;
  }

  get currentVersion(): AggregateVersion {
    return this._currentVersion;
  }
}
