import {AbstractChessGameSuccessDomainEvent} from "./chess-game-abstract-domain-event";
import {ChessGameId} from "../game";
import {DomainEventId} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {EventMetadata} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {ChessBoard} from "../board";
import {Side} from "../pieces";
import {PlayerId} from "../game";

export type ChessGameStartedData = {
  readonly chessGameId: ChessGameId,
  readonly chessBoard: ChessBoard,
  readonly startSide: Side,
  readonly players: { readonly white: PlayerId, readonly black: PlayerId }
};

export class ChessGameStarted extends AbstractChessGameSuccessDomainEvent<ChessGameStartedData> {
  private readonly TYPE = 'ChessGameStarted';

  static event(chessGameId: ChessGameId, occurredAt: Date, data: ChessGameStartedData, metadata: EventMetadata): ChessGameStarted {
    return new ChessGameStarted(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `ChessGameStarted{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
