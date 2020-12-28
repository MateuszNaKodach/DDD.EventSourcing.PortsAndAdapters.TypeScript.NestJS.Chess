import {ChessBoardMvp} from "./chess-board-mvp";
import {Square} from "@ddd-es-ts-chess/chess-domain";
import {PieceWasMoved} from "@ddd-es-ts-chess/chess-domain";
import {PawnPromotionWasEnabled} from "@ddd-es-ts-chess/chess-domain";
import {KingWasChecked} from "@ddd-es-ts-chess/chess-domain";
import {PawnWasPromoted} from "@ddd-es-ts-chess/chess-domain";
import {PromotionPiece} from "@ddd-es-ts-chess/chess-domain";
import {PromotionPieceName} from "@ddd-es-ts-chess/chess-domain";
import {ChessGameFinished} from "@ddd-es-ts-chess/chess-domain";
import {DomainEvent} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {isNotDefined} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {Piece, PlayerId} from "@ddd-es-ts-chess/chess-domain";

export class ChessBoardPresenter implements ChessBoardMvp.Presenter {

  private selectedPieceOn: Square | undefined = undefined;

  constructor(private readonly model: ChessBoardMvp.Model, private readonly view: ChessBoardMvp.View) {
  }

  loadChessBoard(): void {
    const chessBoard = this.model.board;
    this.view.showChessBoard(chessBoard);
    const checkedKing = chessBoard.checkedKing();
    if (checkedKing) {
      this.view.checkKingOn(checkedKing.square);
    }
    this.view.showCurrentSide(this.model.currentSide)
  }

  selectSquare(square: Square): void {
    if (isNotDefined(this.selectedPieceOn)) {
      this.selectedPieceOn = square;
      const availableMoves = this.model.movesForPiece(square, this.model.currentSide);
      if (availableMoves && availableMoves.length > 0) {
        this.view.showSelectedPieceAvailableMoves(availableMoves);
        this.view.showSelectedPieceOn(square)
      } else {
        this.view.hideSelectedPieceAvailableMoves();
        this.view.notShowSelectedPiece()
        this.selectedPieceOn = undefined;
      }
    } else {
      this.model.movePiece({
        by: PlayerId.of(this.model.currentSide),
        from: this.selectedPieceOn,
        to: square
      }).handleEvents(this.handle);
      this.view.notShowSelectedPiece()
      this.selectedPieceOn = undefined;
    }
  }

  promotePawn(by: PlayerId, pawnSquare: Square, toPiece: PromotionPiece): void {
    this.model.promotePawn(by, pawnSquare, toPiece).handleEvents(this.handle);
    this.view.showCurrentSide(this.model.currentSide)
  }

  eventHandlers: { [key: string]: (event: any) => unknown } = {
    PieceWasMoved: ({data}: PieceWasMoved) =>
        this.view.moveSelectedPiece(data),
    PieceWasNotMoved: () =>
        this.view.hideSelectedPieceAvailableMoves(),
    KingWasChecked: ({data}: KingWasChecked) =>
        this.view.checkKingOn(data.onSquare),
    KingWasUnchecked: () =>
        this.view.uncheckKing(),
    PawnPromotionWasEnabled: ({data}: PawnPromotionWasEnabled) =>
        this.view.showPawnPromotionSelection(data.onSquare, data.pawn.side),
    PawnWasPromoted: ({data}: PawnWasPromoted) =>
        this.view.changePawnToPromoted(data.onSquare, {name: data.to.name as PromotionPieceName, side: data.to.side}),
    ChessGameFinished: ({data}: ChessGameFinished) =>
        this.view.showGameResult(data.result),
    Any: (event: DomainEvent) => {
      console.log(event)
      this.view.showCurrentSide(this.model.currentSide)
    }
  }

  private handle = (event: DomainEvent) => {
    const eventHandler = this.eventHandlers[event.eventType]
    if (eventHandler) {
      eventHandler(event)
    }
    this.eventHandlers.Any(event)
  };
}
