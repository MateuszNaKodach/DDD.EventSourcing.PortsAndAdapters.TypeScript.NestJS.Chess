import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { Square } from "../board/square";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type PawnWasNotPromotedData = {
  onSquare: Square,
  reason: string
};

export class PawnWasNotPromoted extends AbstractChessGameSuccessDomainEvent<PawnWasNotPromotedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: PawnWasNotPromotedData, metadata: EventMetadata): PawnWasNotPromoted {
    return new PawnWasNotPromoted(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }
}
