import { v4 as uuid } from "uuid";
import { CorrelationId } from "./correlation-id.valueobject";
import { DomainEventId } from "./domain-event-id.valueobject";

export class CausationId {
  private readonly TYPE = "CausationId";

  private constructor(readonly raw: string) {
  }

  static of(raw: string): CausationId {
    return new CausationId(raw);
  }

  toCorrelation(): CorrelationId {
    return CorrelationId.of(this.raw);
  }

  static fromEventId(eventId: DomainEventId): CausationId{
    return CausationId.of(eventId.raw)
  }

  static generate(): CausationId {
    return new CausationId(uuid());
  }

  toString(): string {
    return this.raw;
  }
}
