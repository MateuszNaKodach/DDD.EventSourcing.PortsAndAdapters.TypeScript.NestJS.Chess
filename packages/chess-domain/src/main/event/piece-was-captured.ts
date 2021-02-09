import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Piece} from "../pieces";
import { Square } from "../board";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type PieceWasCapturedData = {
  piece: Piece;
  onSquare: Square;
  byMove: {piece: Piece, from: Square, to: Square}
};

export class PieceWasCaptured extends AbstractChessGameSuccessDomainEvent<PieceWasCapturedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: PieceWasCapturedData, metadata: EventMetadata): PieceWasCaptured {
    return new PieceWasCaptured(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `PieceWasCaptured{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
