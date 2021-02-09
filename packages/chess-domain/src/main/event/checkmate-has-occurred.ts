import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {King} from "../pieces/king";
import { Square } from "../board/square";
import {Piece} from "../pieces/piece";

export type CheckmateOccurredData = {
  king: King,
  onSquare: Square,
  byMove: {piece: Piece, from: Square, to: Square}
};

export class CheckmateHasOccurred extends AbstractChessGameSuccessDomainEvent<CheckmateOccurredData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: CheckmateOccurredData, metadata: EventMetadata): CheckmateHasOccurred {
    return new CheckmateHasOccurred(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `CheckmateHasOccurred{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
