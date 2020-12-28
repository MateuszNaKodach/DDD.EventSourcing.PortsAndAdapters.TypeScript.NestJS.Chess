import { AbstractChessGameFailureDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { Square } from "../board/square";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type PieceWasNotMovedData = {
  from: Square;
  to: Square;
  reason: string;
};

export class PieceWasNotMoved extends AbstractChessGameFailureDomainEvent<PieceWasNotMovedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: PieceWasNotMovedData, metadata: EventMetadata): PieceWasNotMoved {
    return new PieceWasNotMoved(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }
}
