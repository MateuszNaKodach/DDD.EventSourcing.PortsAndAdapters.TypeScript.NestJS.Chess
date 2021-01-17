import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Side} from "../pieces/side";
//TODO: Not used!
export type ChessGameWasLostData = {
  loser: Side,
  reason: LossReason
};

export type LossReason = { name: "Stalemate", on: Side } | { name: "Checkmate", kingOn: Side }

export class ChessGameWasLost extends AbstractChessGameSuccessDomainEvent<ChessGameWasLostData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: ChessGameWasLostData, metadata: EventMetadata): ChessGameWasLost {
    return new ChessGameWasLost(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `ChessGameWasLost{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
