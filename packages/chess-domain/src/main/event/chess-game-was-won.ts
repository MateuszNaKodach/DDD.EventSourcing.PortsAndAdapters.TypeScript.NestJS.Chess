import { AbstractChessGameSuccessDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Side} from "../pieces";

//TODO: Not used!
export type ChessGameWasWonData = {
  readonly winner: Side,
  readonly reason: WonReason
};

export type WonReason = { name: "Stalemate", on: Side } | { name: "Checkmate", kingOn: Side }

export class ChessGameWasWon extends AbstractChessGameSuccessDomainEvent<ChessGameWasWonData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: ChessGameWasWonData, metadata: EventMetadata): ChessGameWasWon {
    return new ChessGameWasWon(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `ChessGameWasWon{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
