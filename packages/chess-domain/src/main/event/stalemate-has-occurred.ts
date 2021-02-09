import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Side} from "../pieces/side";
import {Piece} from "../pieces/piece";
import { Square } from "../board/square";

export type StalemateOccurredData = {
  for: Side,
  byMove: {piece: Piece, from: Square, to: Square}
};

export class StalemateHasOccurred extends AbstractChessGameSuccessDomainEvent<StalemateOccurredData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: StalemateOccurredData, metadata: EventMetadata): StalemateHasOccurred {
    return new StalemateHasOccurred(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `StalemateHasOccurred{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
