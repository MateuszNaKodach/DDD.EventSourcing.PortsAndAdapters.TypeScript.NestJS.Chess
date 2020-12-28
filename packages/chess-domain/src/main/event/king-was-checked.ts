import { Square } from "../board/square";
import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {King} from "../pieces/king";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type KingWasCheckedData = {
  king: King,
  onSquare: Square
};

export class KingWasChecked extends AbstractChessGameSuccessDomainEvent<KingWasCheckedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: KingWasCheckedData, metadata: EventMetadata): KingWasChecked {
    return new KingWasChecked(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }
}
