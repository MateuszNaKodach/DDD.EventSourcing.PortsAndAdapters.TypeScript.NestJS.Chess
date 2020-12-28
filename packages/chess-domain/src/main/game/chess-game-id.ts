import { AggregateId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { v4 as uuid } from "uuid";

export class ChessGameId implements AggregateId {
  private readonly TYPE = "ChessGameId";

  private constructor(readonly raw: string) {
  }

  static of(raw: string): ChessGameId {
    return new ChessGameId(raw);
  }

  static generate(): ChessGameId {
    return new ChessGameId(uuid());
  }

  toString(): string {
    return this.raw;
  }
}
