import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { Square } from "../board/square";
import {Pawn} from "../pieces/pawn";
import { PromotionPiece } from "../pieces/promotion-piece";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type PawnWasPromotedData = {
  onSquare: Square,
  from: Pawn,
  to: PromotionPiece
};

export class PawnWasPromoted extends AbstractChessGameSuccessDomainEvent<PawnWasPromotedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: PawnWasPromotedData, metadata: EventMetadata): PawnWasPromoted {
    return new PawnWasPromoted(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `PawnWasPromoted{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
