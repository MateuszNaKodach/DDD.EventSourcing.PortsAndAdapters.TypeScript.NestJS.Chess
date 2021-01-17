import { AbstractChessGameFailureDomainEvent } from "./chess-game-abstract-domain-event";
import { ChessGameId } from "../game/chess-game-id";
import { DomainEventId } from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import { EventMetadata } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export type ChessGameNotStartedData = {
  reason: string;
};

export class ChessGameNotStarted extends AbstractChessGameFailureDomainEvent<ChessGameNotStartedData> {
  static event(chessGameId: ChessGameId, occurredAt: Date, data: ChessGameNotStartedData, metadata: EventMetadata): ChessGameNotStarted {
    return new ChessGameNotStarted(DomainEventId.generate(), occurredAt, chessGameId, data, metadata);
  }

  public toString = () : string => {
    return `ChessGameNotStarted{chessGameId=${this.chessGameId}, occurredAt=${this.occurredAt}, data=${JSON.stringify(this.data)}, metadata=${JSON.stringify(this.metadata)}}`;
  }
}
