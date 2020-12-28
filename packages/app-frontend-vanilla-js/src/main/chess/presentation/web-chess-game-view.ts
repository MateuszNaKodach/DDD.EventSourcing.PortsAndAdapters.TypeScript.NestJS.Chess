import {
  ChessBoard,
  isPromotionPieceName,
  MoveType,
  PieceMove,
  PieceMoved,
  PieceName,
  Pieces,
  PromotionPieceName,
  Side,
  Square
} from "@ddd-es-ts-chess/chess-domain";
import {ChessBoardMvp} from "./chess-board-mvp";
import {ChessGameHistoryMvp} from "./chess-game-history-mvp";
import {PlayerId, PromotionPiece} from "@ddd-es-ts-chess/chess-domain";
import {SquareView} from "./square-view";

const ICON_HTML_TAG_NAME = "I";
const CSS_NORMAL_MOVE_CLASS_NAME = "normal-move";
const CSS_ATTACK_MOVE_CLASS_NAME = "attack-move";


export default class WebChessGameView implements ChessBoardMvp.View, ChessGameHistoryMvp.View {

  private readonly chessBoardPresenter: ChessBoardMvp.Presenter;
  private readonly chessGameHistoryPresenter: ChessGameHistoryMvp.Presenter;

  constructor(
      chessBoardPresenterSupplier: (view: ChessBoardMvp.View) => ChessBoardMvp.Presenter,
      chessGameHistoryPresenterSupplier: (view: ChessGameHistoryMvp.View) => ChessGameHistoryMvp.Presenter
  ) {
    this.chessBoardPresenter = chessBoardPresenterSupplier(this);
    this.chessGameHistoryPresenter = chessGameHistoryPresenterSupplier(this);
    this.chessBoardPresenter.loadChessBoard();
    this.registerBoardClickListener();
    this.registerUndoButtonClickListener();
  }

  showChessBoard(chessBoard: ChessBoard): void {
    for (let row = chessBoard.width; row >= 1; row--) {
      for (let column = 1; column <= chessBoard.height; column++) {
        const squareView = new SquareView({
          column: column as Square.Number,
          row: row as Square.Number
        }, square => chessBoard.pieceOn(square));
        this.boardHtmlElement()!.appendChild(squareView.html());
      }
    }
  }

  private clearChessBoard() {
    while (this.boardHtmlElement()!.firstChild) {
      this.boardHtmlElement()!.removeChild(this.boardHtmlElement().firstChild!);
    }
  }

  private boardHtmlElement(): HTMLElement {
    return document.getElementById("board")!;
  }

  private registerBoardClickListener() {
    this.boardHtmlElement()!.addEventListener("click", this.boardTouched.bind(this));
  }


  private registerUndoButtonClickListener() {
    document.querySelector("#undoBtn")!.addEventListener("click", this.undoLastMove.bind(this));
  }

  private showPieceIcon(squareToChangeId: string, pieceName: PieceName, pieceSide: Side) {
    const squareHtml = document.getElementById(squareToChangeId);
    if (squareHtml && squareHtml.parentNode) {
      const squareView = SquareView.fromHtml(squareHtml);
      squareHtml.parentNode.replaceChild(
          squareView.withPiece(Pieces.getBy(pieceName, pieceSide)).html(), squareHtml
      );
    }
  }

  private boardTouched(clickEvent: MouseEvent) {
    const squareView = this.clickedSquareView(clickEvent);
    this.chessBoardPresenter.selectSquare(squareView.square);
  }

  showPawnPromotionSelection(pawnSquare: Square, pawnSide: Side): void {
    const promptResult = prompt("You can promote your pawn. Choose the new piece.", "Queen");
    const newPieceName = promptResult == null ? undefined : promptResult;
    if (!newPieceName || !isPromotionPieceName(newPieceName)) {
      this.showInvalidPieceNameAlert(newPieceName, pawnSquare, pawnSide);
    } else {
      this.chessBoardPresenter.promotePawn(PlayerId.of(pawnSide), pawnSquare, Pieces.getBy(newPieceName, pawnSide) as PromotionPiece);
    }
  }

  changePawnToPromoted(onSquare: Square, promotedTo: { name: PromotionPieceName, side: Side }): void {
    this.showPieceIcon(onSquare.id, promotedTo.name, promotedTo.side);
  }

  showCurrentSide(side: Side): void {
    const currentSideHtml = document.getElementById("app-current-player");
    currentSideHtml && (currentSideHtml.innerHTML = `<p>Current player: ${side}</p>`);
  }

  private showInvalidPieceNameAlert(newPiece: string | undefined, pawnSquare: Square, pawnSide: Side) {
    alert("Invalid piece name: " + newPiece);
    this.showPawnPromotionSelection(pawnSquare, pawnSide);
  }

  showSelectedPieceAvailableMoves(availableMoves: PieceMove[]): void {
    this.showAvailableMoves(availableMoves);
  }

  moveSelectedPiece(pieceMoved: PieceMoved): void {
    this.hidePieceIcon(pieceMoved);
    this.showPieceIcon(pieceMoved.to.id, pieceMoved.piece.name, pieceMoved.piece.side);
    this.hideSelectedPieceAvailableMoves();
  }

  private hidePieceIcon(pieceMoved: PieceMoved) {
    const squareId = pieceMoved.from.id;
    const squareHtml = document.getElementById(squareId);
    if (squareHtml && squareHtml.parentNode) {
      const squareView = SquareView.fromHtml(squareHtml);
      squareHtml.parentNode.replaceChild(squareView.withoutPiece().html(), squareHtml);
    }
  }

  private clickedSquareView(clickEvent: MouseEvent): SquareView {
    const eventTarget = clickEvent.target as Element;
    const squareHtml = this.isPieceIconClicked(clickEvent) ? (eventTarget.parentNode as Element) : eventTarget;
    return SquareView.fromHtml(squareHtml)
  }

  private isPieceIconClicked(clickEvent: MouseEvent): boolean {
    const eventTarget = clickEvent.target as Element;
    return eventTarget.tagName === ICON_HTML_TAG_NAME;
  }

  private showAvailableMoves(moves: PieceMove[]): void {
    for (const move of moves) {
      if (move.type === MoveType.ATTACK) {
        document.getElementById(move.square.id)!.classList.add(CSS_ATTACK_MOVE_CLASS_NAME);
      } else {
        document.getElementById(move.square.id)!.classList.add(CSS_NORMAL_MOVE_CLASS_NAME);
      }
    }
  }

  hideSelectedPieceAvailableMoves(): void {
    const shownMoves = [...document.getElementsByClassName(CSS_NORMAL_MOVE_CLASS_NAME), ...document.getElementsByClassName(CSS_ATTACK_MOVE_CLASS_NAME)];
    for (let i = 0; i < shownMoves.length; i++) {
      shownMoves[i].classList.remove(CSS_NORMAL_MOVE_CLASS_NAME, CSS_ATTACK_MOVE_CLASS_NAME);
    }
  }

  private undoLastMove() {
    this.chessGameHistoryPresenter.undoLastMove();
  }

  onLastMoveUndone(): void {
    this.clearChessBoard();
    this.chessBoardPresenter.loadChessBoard();
  }

  checkKingOn(kingSquare: Square): void {
    const squareId = kingSquare.id;
    const squareHtml = document.getElementById(squareId);
    if (squareHtml && squareHtml.parentNode) {
      const squareView = SquareView.fromHtml(squareHtml);
      squareHtml.parentNode.replaceChild(squareView.checked().html(), squareHtml);
    }
  }

  uncheckKing(): void {
    const checkedSquares = document.getElementsByClassName("checked-square");
    for (let i = 0; i < checkedSquares.length; i++) {
      const squareHtml = checkedSquares[i];
      if (squareHtml && squareHtml.parentNode) {
        const squareView = SquareView.fromHtml(squareHtml);
        squareHtml.parentNode.replaceChild(squareView.unchecked().html(), squareHtml);
      }
    }
  }

  showSelectedPieceOn(square: Square): void {
    const squareId = square.id;
    const squareHtml = document.getElementById(squareId);
    if (squareHtml && squareHtml.parentNode) {
      const squareView = SquareView.fromHtml(squareHtml);
      squareHtml.parentNode.replaceChild(squareView.selected().html(), squareHtml);
    }
  }

  notShowSelectedPiece(): void {
    const checkedSquares = document.getElementsByClassName("app-selected-square");
    for (let i = 0; i < checkedSquares.length; i++) {
      const squareHtml = checkedSquares[i];
      if (squareHtml && squareHtml.parentNode) {
        const squareView = SquareView.fromHtml(squareHtml);
        squareHtml.parentNode.replaceChild(squareView.notSelected().html(), squareHtml);
      }
    }
  }

  showGameResult(result: { name: "Win"; winner: Side; reason: { name: "Stalemate"; on: Side } | { name: "Checkmate"; kingOn: Side } } | { name: "Draw"; reason: { name: "Stalemate"; on: Side } }): void {
    const currentSideHtml = document.getElementById("app-game-result");
    currentSideHtml && (currentSideHtml.innerHTML = `<p>Game finished with ${result.reason.name} ${result.name === "Win" ? "The winner is: " + result.winner : "Nobody won!"}</p>`);
  }

}

