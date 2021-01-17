import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { Square } from "../board/square";
import {Pawn} from "../pieces/pawn";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type PawnPromotionWasEnabledData = {
  onSquare: Square,
  pawn: Pawn
};

export class PawnPromotionWasEnabled extends AbstractChessGameSuccessDomainEvent<PawnPromotionWasEnabledData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: PawnPromotionWasEnabledData, metadata: EventMetadata): PawnPromotionWasEnabled {
    return new PawnPromotionWasEnabled(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `PawnPromotionWasEnabled{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
