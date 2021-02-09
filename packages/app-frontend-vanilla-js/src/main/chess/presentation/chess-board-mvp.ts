import {Piece, Square} from "@ddd-es-ts-chess/chess-domain";
import {PieceMoveEffect} from "@ddd-es-ts-chess/chess-domain";
import {PieceMoved} from "@ddd-es-ts-chess/chess-domain";
import {PieceWasNotMoved as PieceNotMovedEvent} from "@ddd-es-ts-chess/chess-domain";
import {KingWasChecked} from "@ddd-es-ts-chess/chess-domain";
import {PawnWasPromoted} from "@ddd-es-ts-chess/chess-domain";
import {PawnWasNotPromoted} from "@ddd-es-ts-chess/chess-domain";
import {Side} from "@ddd-es-ts-chess/chess-domain";
import {PromotionPiece} from "@ddd-es-ts-chess/chess-domain";
import {PromotionPieceName} from "@ddd-es-ts-chess/chess-domain";
import {PieceMove} from "@ddd-es-ts-chess/chess-domain";
import {ChessBoard} from "@ddd-es-ts-chess/chess-domain";
import {Success, Failure} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {PlayerId} from "@ddd-es-ts-chess/chess-domain";

export namespace ChessBoardMvp {
  export interface Model {
    readonly board: ChessBoard;
    readonly currentSide: Side

    movesForPiece(square: Square, side: Side): PieceMove[] | undefined;

    movePiece(props: { by: PlayerId, from: Square, to: Square }): Success<PieceMoveEffect> | Failure<PieceNotMovedEvent>;

    promotePawn(by: PlayerId, onSquare: Square, toPiece: PromotionPiece): Success<PawnWasPromoted | KingWasChecked> | Failure<PawnWasNotPromoted>
  }

  export interface Presenter {

    loadChessBoard(): void

    selectSquare(square: Square): void

    promotePawn(by: PlayerId, pawnSquare: Square, toPiece: PromotionPiece): void;
  }

  export interface View {

    showChessBoard(chessBoard: ChessBoard): void;

    showSelectedPieceAvailableMoves(availableMoves: PieceMove[]): void;

    moveSelectedPiece(pieceMoved: PieceMoved): void;

    removeCapturedPiece(onSquare: Square, piece: Piece): void

    hideSelectedPieceAvailableMoves(): void;

    showPawnPromotionSelection(pawnSquare: Square, pawnSide: Side): void

    checkKingOn(kingSquare: Square): void

    uncheckKing(): void

    changePawnToPromoted(onSquare: Square, promotedTo: { name: PromotionPieceName, side: Side }): void

    showCurrentSide(side: Side): void

    showGameResult(result: { name: "Win"; winner: Side; reason: { name: "Stalemate"; on: Side } | { name: "Checkmate"; kingOn: Side } } | { name: "Draw"; reason: { name: "Stalemate"; on: Side } }): void;

    showSelectedPieceOn(square: Square): void

    notShowSelectedPiece(): void
  }
}
