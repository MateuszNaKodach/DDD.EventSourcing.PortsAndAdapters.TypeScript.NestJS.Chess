import {AbstractChessGameSuccessDomainEvent} from "./chess-game-abstract-domain-event";
import {ChessGameId} from "../game";
import {EventMetadata} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {DomainEventId} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Side} from "../pieces";

export type ChessGameFinishedData = {
  readonly result: {
    readonly name: "Win",
    readonly winner: Side,
    readonly reason: { readonly name: "Stalemate", readonly on: Side } | { readonly name: "Checkmate", readonly kingOn: Side }
  } | {
    readonly name: "Draw",
    readonly reason: { name: "Stalemate", on: Side }
  }
};

export class ChessGameFinished extends AbstractChessGameSuccessDomainEvent<ChessGameFinishedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: ChessGameFinishedData, metadata: EventMetadata): ChessGameFinished {
    return new ChessGameFinished(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `ChessGameFinished{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
