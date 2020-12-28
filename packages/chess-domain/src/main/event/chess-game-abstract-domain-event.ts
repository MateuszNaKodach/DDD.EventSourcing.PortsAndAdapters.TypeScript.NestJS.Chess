import {ChessGameId} from "../game";
import {AbstractSuccessDomainEvent} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {
  DomainEventId,
  FailureReason,
  AbstractFailureDomainEvent,
  EventMetadata
} from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export abstract class AbstractChessGameSuccessDomainEvent<P = any, M extends EventMetadata = EventMetadata>
    extends AbstractSuccessDomainEvent<ChessGameId, P, M> {

  constructor(eventId: DomainEventId, occurredAt: Date, aggregateId: ChessGameId, data: P, metadata: M) {
    super(eventId, occurredAt, aggregateId, data, metadata);
  }

  get aggregateType(): string {
    return "ChessGame";
  }

  get chessGameId(): ChessGameId {
    return this.aggregateId
  }
}

export abstract class AbstractChessGameFailureDomainEvent<P extends FailureReason = FailureReason, M extends EventMetadata = EventMetadata>
    extends AbstractFailureDomainEvent<ChessGameId, P, M> {

  constructor(eventId: DomainEventId, occurredAt: Date, aggregateId: ChessGameId, data: P, metadata: M) {
    super(eventId, occurredAt, aggregateId, data, metadata);
  }

  get aggregateType(): string {
    return "ChessGame";
  }

  get chessGameId(): ChessGameId {
    return this.aggregateId
  }
}

export type ChessGameDomainEvent = AbstractChessGameSuccessDomainEvent | AbstractChessGameFailureDomainEvent
