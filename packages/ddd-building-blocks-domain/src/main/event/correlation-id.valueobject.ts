import { v4 as uuid } from "uuid";

export class CorrelationId {
  private readonly TYPE = "CorrelationId";

  private constructor(readonly raw: string) {
  }

  static of(raw: string): CorrelationId {
    return new CorrelationId(raw);
  }

  static generate(): CorrelationId {
    return new CorrelationId(uuid());
  }

  toString(): string {
    return this.raw;
  }

  equals(anotherId: CorrelationId | undefined): boolean {
    return anotherId !== undefined && this.raw === anotherId.raw;
  }
}
