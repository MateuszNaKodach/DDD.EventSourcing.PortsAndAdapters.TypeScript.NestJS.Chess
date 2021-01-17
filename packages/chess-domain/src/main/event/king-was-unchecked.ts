import { Square } from "../board/square";
import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Side} from "../pieces/side";
import {Piece} from "../pieces/piece";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type KingWasUncheckedData = {
  king: { side: Side },
  onSquare: Square
  afterMove: { piece: Piece; from: Square; to: Square; captured?: Piece }
};

export class KingWasUnchecked extends AbstractChessGameSuccessDomainEvent<KingWasUncheckedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: KingWasUncheckedData, metadata: EventMetadata): KingWasUnchecked {
    return new KingWasUnchecked(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `KingWasUnchecked{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
