import { Side } from '../pieces';
import { ChessBoard } from '../board';
import { Piece } from '../pieces';
import { Square } from '../board';
import { PieceMove } from '../pieces';
import { Pawn } from '../pieces';
import { ChessGameId } from './chess-game-id';
import { Failure, Result, Success } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { PieceWasNotMoved as PieceNotMovedEvent, PieceWasNotMovedData } from '../event/piece-was-not-moved';
import { PieceWasMoved, PieceWasMoved as PieceMovedEvent } from '../event/piece-was-moved';
import { TimeProvider } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import {
  ChessGameDomainEvent,
  PawnPromotionWasEnabled,
} from '../event';
import { KingWasChecked } from '../event';
import { KingWasUnchecked } from '../event';
import { PawnWasPromoted, PawnWasPromotedData } from '../event';
import { PawnWasNotPromoted, PawnWasNotPromotedData } from '../event';
import { PieceWasCaptured } from '../event';
import { DomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { PromotionPiece } from '../pieces';
import { CausationId } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { CorrelationId } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { ChessGameHistoryLog } from '../history';
import { ChessGameStarted } from '../event';
import { CheckmateHasOccurred } from '../event';
import { StalemateHasOccurred } from '../event';
import { ChessGameFinished } from '../event';
import { isDefined, isNotDefined } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { DomainEvents } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { PlayerId } from './player-id';
import { ChessGameNotStarted, ChessGameNotStartedData } from '../event/chess-game-not-started';

export class ChessGame {

  private gameHistory: ChessGameHistoryLog = ChessGameHistoryLog.empty();
  private state!: ChessGameState;
  private events: DomainEvents = DomainEvents.clean();

  private constructor(private readonly timeProvider: TimeProvider) {
  }

  static with(props: { timeProvider: TimeProvider }): ChessGame {
    return new ChessGame(props.timeProvider);
  }

  static from(events: ChessGameDomainEvent[]): (timeProvider: TimeProvider) => ChessGame {
    return (timeProvider: TimeProvider) => {
      if (!events || events.length === 0) {
        throw new Error('Cannot reconstruct chess game from empty events');
      }
      const [started] = events;
      if (!(started instanceof ChessGameStarted)) {
        throw new Error('Invalid first event!');
      }
      return events
        .reduce((chessGame, event) => chessGame.onEvent(event, true), ChessGame.with({ timeProvider }));
    };
  }

  start = (
    command: { readonly chessBoard: ChessBoard, readonly id: ChessGameId, readonly startSide: Side, readonly players: Players },
  ): Success<ChessGameStarted> | Failure<ChessGameNotStarted> => {
    const causationId = CausationId.generate();
    const correlationId = causationId.toCorrelation();
    const eventMetadata = { correlationId, causationId };
    if (this.state && this.state.started) {
      const chessGameNotStarted: ChessGameNotStartedData = {
        reason: 'Chess game has already started!',
      };
      return Result.failure(ChessGameNotStarted.event(command.id, this.timeProvider.currentDate(), chessGameNotStarted, eventMetadata));
    }

    const chessGameStarted = ChessGameStarted.event(command.id, this.timeProvider.currentDate(), {
      chessGameId: command.id,
      chessBoard: command.chessBoard,
      startSide: command.startSide,
      players: command.players,
    }, eventMetadata);

    const result = Result.success(chessGameStarted);
    result.handleEvents(this.onEvent);
    return result;
  };

  movePiece = (
    command: { by: PlayerId, from: Square, to: Square },
  ): Success<PieceMoveEffect> | Failure<PieceNotMovedEvent> =>
    this.executeCommand(({ chessGameId, occurredAt }, eventMetadata) => {
      if (!this.state.started) {
        const pieceNotMoved: PieceWasNotMovedData = {
          from: command.from,
          to: command.to,
          reason: 'Chess game has not already started!',
        };
        return Result.failure(PieceNotMovedEvent.event(chessGameId, occurredAt, pieceNotMoved, eventMetadata));
      }
      if (this.state.finished) {
        const pieceNotMoved: PieceWasNotMovedData = {
          from: command.from,
          to: command.to,
          reason: 'Chess game has already finished!',
        };
        return Result.failure(PieceNotMovedEvent.event(chessGameId, occurredAt, pieceNotMoved, eventMetadata));
      }
      if (this.state.currentPromotion) {
        const pieceNotMoved: PieceWasNotMovedData = {
          from: command.from,
          to: command.to,
          reason: `Promotion for #${this.state.currentPromotion.pawn.side} on square ${this.state.currentPromotion.onSquare} is in progress!`,
        };
        return Result.failure(PieceNotMovedEvent.event(chessGameId, occurredAt, pieceNotMoved, eventMetadata));
      }
      const piece = this.state.chessBoard.pieceOn(command.from);
      if (!isDefined(piece) || piece.side !== this.sideOf(command.by)) {
        const pieceNotMoved: PieceWasNotMovedData = {
          from: command.from,
          to: command.to,
          reason: `Piece on square ${command.from.algebraicNotation} is not piece of players with id ${command.by.toString()}!`,
        };
        return Result.failure(PieceNotMovedEvent.event(chessGameId, occurredAt, pieceNotMoved, eventMetadata));
      }
      if (!isDefined(piece) || piece.side !== this.state.currentSide) {
        const pieceNotMoved: PieceWasNotMovedData = {
          from: command.from,
          to: command.to,
          reason: `Piece on square ${command.from.algebraicNotation} is not current player selected piece!`,
        };
        return Result.failure(PieceNotMovedEvent.event(chessGameId, occurredAt, pieceNotMoved, eventMetadata));
      }
      const pieceAvailableMoves = piece.getAvailableMoves(this.state.chessBoard, command.from);
      const canMoveToSelectedSquare = pieceAvailableMoves.map(move => move.square.id).includes(command.to.id);
      if (!canMoveToSelectedSquare) {
        const pieceNotMoved: PieceWasNotMovedData = {
          from: command.from,
          to: command.to,
          reason: 'Selected square is not available for the piece!',
        };
        return Result.failure(PieceNotMovedEvent.event(chessGameId, occurredAt, pieceNotMoved, eventMetadata));
      }

      const moveResult = this.state.chessBoard.withMovedPiece(piece, command.from, command.to);
      const afterPieceMoveEvents = moveResult.moves
        .map(pieceMoved => this.calculateMoveEffect(PieceMovedEvent.event(chessGameId, occurredAt, pieceMoved, eventMetadata)))
        .reduce((e1, e2) => [...e1, ...e2]);
      return Result.success(afterPieceMoveEvents);
    });

  private sideOf(player: PlayerId): Side | undefined {
    if (player.equals(this.state.players.white)) {
      return Side.WHITE;
    }
    if (player.equals(this.state.players.black)) {
      return Side.BLACK;
    }
    return undefined;
  }

  private calculateMoveEffect(pieceMovedEvent: PieceMovedEvent): PieceMoveEffect[] {
    const events: PieceMoveEffect[] = [pieceMovedEvent];
    const pieceCaptured = this.pieceCaptureMoveEffect(pieceMovedEvent);
    if (pieceCaptured) {
      events.push(pieceCaptured);
    }
    const promotionEnabled = this.pawnPromotionMoveEffect(pieceMovedEvent);
    if (promotionEnabled) {
      events.push(promotionEnabled);
    }
    const kingCheckChanged = this.kingCheckMoveEffect(pieceMovedEvent);
    if (kingCheckChanged) {
      events.push(kingCheckChanged);
    }
    const checkmateOccurred = this.checkmateMoveEffect(pieceMovedEvent);
    if (checkmateOccurred) {
      events.push(checkmateOccurred);
      events.push(
        ChessGameFinished.event(this.state.id, this.timeProvider.currentDate(),
          {
            result: {
              name: 'Win',
              winner: Side.another(checkmateOccurred.data.king.side),
              reason: {
                name: 'Checkmate',
                kingOn: checkmateOccurred.data.king.side,
              },
            },
          },
          {
            correlationId: checkmateOccurred.metadata.correlationId,
            causationId: CausationId.fromEventId(checkmateOccurred.eventId),
          }),
      );
    }
    const stalemateOccurred = this.stalemateMoveEffect(pieceMovedEvent);
    if (stalemateOccurred) {
      events.push(stalemateOccurred);
      events.push(
        ChessGameFinished.event(this.state.id, this.timeProvider.currentDate(),
          {
            result: {
              name: 'Draw',
              reason: {
                name: 'Stalemate',
                on: stalemateOccurred.data.for,
              },
            },
          },
          {
            correlationId: stalemateOccurred.metadata.correlationId,
            causationId: CausationId.fromEventId(stalemateOccurred.eventId),
          }),
      );
    }
    return events;
  }

  private kingCheckMoveEffect({ eventId, data, metadata }: PieceMovedEvent): KingWasChecked | KingWasUnchecked | undefined {
    const pieceMoved = data;
    const boardAfterMove = this.state.chessBoard.withMovedPiece(pieceMoved.piece, pieceMoved.from, pieceMoved.to).board;
    const checkedKing = boardAfterMove.checkedKing();
    if (checkedKing) {
      return KingWasChecked.event(this.state.id, this.timeProvider.currentDate(),
        { king: checkedKing.piece, onSquare: checkedKing.square },
        { ...metadata, causationId: CausationId.fromEventId(eventId) },
      );
    } else if (this.state.checkedKing) {
      return KingWasUnchecked.event(this.state.id, this.timeProvider.currentDate(),
        { king: this.state.checkedKing.piece, onSquare: this.state.checkedKing.square, afterMove: pieceMoved },
        { ...metadata, causationId: CausationId.fromEventId(eventId) },
      );
    }
    return undefined;
  }

  private pawnPromotionMoveEffect({ eventId, data, metadata }: PieceMovedEvent): PawnPromotionWasEnabled | undefined {
    const pieceMoved = data;
    const isPromotionAvailable = Pawn.isPawn(pieceMoved.piece) && pieceMoved.piece.isOnTheOppositeEdgeOfTheBoard(pieceMoved.to);
    if (!isPromotionAvailable) {
      return undefined;
    }
    return PawnPromotionWasEnabled.event(this.state.id, this.timeProvider.currentDate(),
      { onSquare: pieceMoved.to, pawn: pieceMoved.piece as Pawn },
      { ...metadata, causationId: CausationId.fromEventId(eventId) },
    );
  }

  private pieceCaptureMoveEffect({ eventId, data, metadata }: PieceMovedEvent): PieceWasCaptured | undefined {
    const pieceMoved = data;
    if (!pieceMoved.captured) {
      return undefined;
    }
    return PieceWasCaptured.event(this.state.id, this.timeProvider.currentDate(),
      {
        onSquare: pieceMoved.captured.onSquare,
        piece: pieceMoved.captured.piece,
        byMove: { piece: pieceMoved.piece, from: pieceMoved.from, to: pieceMoved.to },
      },
      { ...metadata, causationId: CausationId.fromEventId(eventId) },
    );
  }

  private checkmateMoveEffect({ eventId, data, metadata }: PieceWasMoved): CheckmateHasOccurred | undefined {
    const pieceMoved = data;
    const checkedKing = this.state.chessBoard.checkedKing();
    if (!checkedKing || !checkedKing.piece.isCheckmate(this.state.chessBoard, checkedKing.square)) {
      return undefined;
    }
    return CheckmateHasOccurred.event(this.state.id, this.timeProvider.currentDate(),
      {
        onSquare: checkedKing.square,
        king: checkedKing.piece,
        byMove: { piece: pieceMoved.piece, from: pieceMoved.from, to: pieceMoved.to },
      },
      { ...metadata, causationId: CausationId.fromEventId(eventId) },
    );
  }

  private stalemateMoveEffect({ eventId, data, metadata }: PieceWasMoved): StalemateHasOccurred | undefined {
    const pieceMoved = data;
    const isStalemateFor = (side: Side) => this.state.chessBoard.isStalemateFor(side);
    const stalemateSide = isStalemateFor(Side.WHITE) ? Side.WHITE : (isStalemateFor(Side.BLACK) ? Side.BLACK : undefined);
    if (!stalemateSide) {
      return undefined;
    }
    return StalemateHasOccurred.event(this.state.id, this.timeProvider.currentDate(),
      {
        for: stalemateSide,
        byMove: { piece: pieceMoved.piece, from: pieceMoved.from, to: pieceMoved.to },
      },
      { ...metadata, causationId: CausationId.fromEventId(eventId) },
    );
  }

  promotePawn = (by: PlayerId, onSquare: Square, toPiece: PromotionPiece): Success<PawnWasPromoted | KingWasChecked> | Failure<PawnWasNotPromoted> =>
    this.executeCommand(({ chessGameId, occurredAt }, eventMetadata) => {
      if (isNotDefined(this.state.currentPromotion) || this.state.currentPromotion.onSquare !== onSquare) {
        const pawnWasNotPromoted: PawnWasNotPromotedData = {
          onSquare,
          reason: `No current promotion on square ${onSquare.algebraicNotation}!`,
        };
        return Result.failure(PawnWasNotPromoted.event(chessGameId, occurredAt, pawnWasNotPromoted, eventMetadata));
      }
      if (isDefined(this.state.currentPromotion) && this.state.currentPromotion.pawn.side !== this.sideOf(by)) {
        const pawnWasNotPromoted: PawnWasNotPromotedData = {
          onSquare,
          reason: `Pawn to promotion does not belongs to player with id ${by}!`,
        };
        return Result.failure(PawnWasNotPromoted.event(chessGameId, occurredAt, pawnWasNotPromoted, eventMetadata));
      }
      const events = [];
      const promotion: PawnWasPromotedData = {
        onSquare,
        from: this.state.currentPromotion.pawn,
        to: toPiece,
      };
      events.push(PawnWasPromoted.event(chessGameId, this.timeProvider.currentDate(), promotion, eventMetadata));
      const chessBoardAfterPromotion = this.state.chessBoard.withPieceOn(promotion.onSquare, promotion.to);
      const checkedKingAfterPromotion = chessBoardAfterPromotion.checkedKing();
      if (isDefined(checkedKingAfterPromotion)) {
        events.push(
          KingWasChecked.event(chessGameId, occurredAt,
            { king: checkedKingAfterPromotion.piece, onSquare: checkedKingAfterPromotion.square },
            eventMetadata,
          ),
        );
      }
      return Result.success(events);
    });

  private recordToHistory(state: ChessGameState) {
    const entry = {
      currentSide: state.currentSide,
      chessBoard: state.chessBoard,
      timestamp: this.timeProvider.currentDate(),
      checkedKing: state.checkedKing,
    };
    this.gameHistory = this.gameHistory.record(entry);
  }

  get board(): ChessBoard {
    return this.state.chessBoard;
  }

  get currentSide(): Side {
    return this.state.currentSide;
  }

  movesForPiece(square: Square, side: Side): PieceMove[] | undefined {
    const piece = this.state.chessBoard.pieceOn(square);
    return isDefined(piece) && piece.side === side ? piece.getAvailableMoves(this.state.chessBoard, square) : undefined;
  }

  undoLastMove(): void {
    const historicalState = this.gameHistory.last();
    if (historicalState) {
      this.updateState({
        chessBoard: historicalState.chessBoard,
        currentSide: historicalState.currentSide,
        checkedKing: historicalState.checkedKing,
      });
      this.gameHistory = this.gameHistory.forgetLast();
    }
  }

  private executeCommand<T extends Result>(
    executor: (eventProps: { chessGameId: ChessGameId, occurredAt: Date }, eventMetadata: { causationId: CausationId, correlationId: CorrelationId }) => T,
  ): T {
    const causationId = CausationId.generate();
    const correlationId = causationId.toCorrelation();
    const result = executor({ chessGameId: this.state.id, occurredAt: this.timeProvider.currentDate() }, {
      causationId,
      correlationId,
    });
    result.handleEvents(this.onEvent);
    return result;
  }

  stateChangeEventHandlers: { [key: string]: (event: any) => ChessGameStateUpdate } = {
    ChessGameStarted: ({ data }: ChessGameStarted) => ({
      id: data.chessGameId,
      chessBoard: data.chessBoard,
      currentSide: data.startSide,
      players: data.players,
      checkedKing: undefined,
      currentPromotion: undefined,
      finished: false,
      started: true,
    }),
    KingWasChecked: ({ data }: KingWasChecked) => ({
      checkedKing: { piece: data.king, square: data.onSquare },
    }),
    KingWasUnchecked: () => ({
      checkedKing: undefined,
    }),
    PieceWasMoved: ({ data }: PieceWasMoved) => ({
      chessBoard: this.state.chessBoard.withMovedPiece(data.piece, data.from, data.to).board,
      currentSide: Side.another(data.piece.side),
    }),
    PawnWasPromoted: ({ data }: PawnWasPromoted) => ({
      chessBoard: this.state.chessBoard.withPieceOn(data.onSquare, data.to),
      currentPromotion: undefined,
    }),
    PawnPromotionWasEnabled: ({ data }: PawnPromotionWasEnabled) => ({
      currentPromotion: data,
    }),
    ChessGameFinished: () => ({
      finished: true,
    }),
  };

  private onEvent = (domainEvent: DomainEvent, isReplaying = false) => {
    if (!isReplaying) {
      this.events = this.events.append(domainEvent);
    }
    if (domainEvent instanceof PieceWasMoved) {
      this.recordToHistory(this.state);
    }
    const stateChangeEventHandler = this.stateChangeEventHandlers[domainEvent.eventType];
    if (stateChangeEventHandler) {
      const stateUpdate = stateChangeEventHandler(domainEvent);
      this.updateState(stateUpdate);
    }
    return this;
  };

  private updateState(update: ChessGameStateUpdate): void {
    this.state = {
      ...this.state,
      ...update,
    };
  }

  get id(): ChessGameId {
    return this.state.id;
  }

  get uncommittedEvents(): DomainEvent[] {
    return this.events.toArray();
  }
}

type ChessGameStateUpdate = Partial<ChessGameState>;

type Players = { white: PlayerId, black: PlayerId }

type ChessGameState = {
  readonly id: ChessGameId,
  readonly chessBoard: ChessBoard,
  readonly currentSide: Side,
  readonly players: Players,
  readonly checkedKing: { square: Square, piece: Piece } | undefined
  readonly currentPromotion: { pawn: Pawn, onSquare: Square } | undefined,
  readonly finished: boolean,
  readonly started: boolean
}

export type PieceMoveEffect =
  PieceMovedEvent
  | PawnPromotionWasEnabled
  | KingWasChecked
  | KingWasUnchecked
  | PieceWasCaptured
  | CheckmateHasOccurred
  | StalemateHasOccurred
  | ChessGameFinished;

