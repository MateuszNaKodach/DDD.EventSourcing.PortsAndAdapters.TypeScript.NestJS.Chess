import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Piece} from "../pieces/piece";
import { Square } from "../board/square";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type PieceWasMovedData = {
  piece: Piece;
  from: Square;
  to: Square;
  captured?: Piece
};

export class PieceWasMoved extends AbstractChessGameSuccessDomainEvent<PieceWasMovedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: PieceWasMovedData, metadata: EventMetadata): PieceWasMoved {
    return new PieceWasMoved(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `PieceWasMoved{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
