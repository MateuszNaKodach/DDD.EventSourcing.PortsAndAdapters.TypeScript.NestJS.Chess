import {Square} from "./square";
import {Bishop, Knight, Pawn, Piece, Queen} from "../pieces";
import {Side} from "../pieces";
import {King} from "../pieces";
import {PieceName} from "../pieces";
import {PieceMoved} from "./move";
import {Rook} from "../pieces";
import {isDefined, isNotDefined} from "@ddd-es-ts-chess/ddd-building-blocks-domain";

const BOARD_SIZE = 8;

export type PieceOnSquare = { piece: Piece, square: Square };
type MovePieceResult = { board: ChessBoard, moves: PieceMoved[] };
export type LastMove = { piece: Piece; from: Square; to: Square; }

/**
 * Szachownica jest niemutowalna (metody nigdy nie zmieniają stanu, ale jeśli modyfikują ustawienie szachów, to zwracają nowy obiekt).
 * Niemutowalność zapewnia, że np. szach, gdy otrzyma szachownicę, nie zmieni ułożenia innych pionków.
 */
export class ChessBoard {

  private readonly movePieceHandler = new OrdinaryMovePieceHandler(new CastlingMovePieceHandler());

  private constructor(private pieces: { [square: string]: Piece } = {}, readonly lastMove: LastMove | undefined = undefined) {
  }

  static empty(): ChessBoard {
    return new ChessBoard({});
  }

  static starting(): ChessBoard {
    return new ChessBoard({
      "A1": new Rook(Side.WHITE),
      "B1": new Knight(Side.WHITE),
      "C1": new Bishop(Side.WHITE),
      "D1": new Queen(Side.WHITE),
      "E1": new King(Side.WHITE),
      "F1": new Bishop(Side.WHITE),
      "G1": new Knight(Side.WHITE),
      "H1": new Rook(Side.WHITE),
      "A2": new Pawn(Side.WHITE),
      "B2": new Pawn(Side.WHITE),
      "C2": new Pawn(Side.WHITE),
      "D2": new Pawn(Side.WHITE),
      "E2": new Pawn(Side.WHITE),
      "F2": new Pawn(Side.WHITE),
      "G2": new Pawn(Side.WHITE),
      "H2": new Pawn(Side.WHITE),
      "A8": new Rook(Side.BLACK),
      "B8": new Knight(Side.BLACK),
      "C8": new Bishop(Side.BLACK),
      "D8": new Queen(Side.BLACK),
      "E8": new King(Side.BLACK),
      "F8": new Bishop(Side.BLACK),
      "G8": new Knight(Side.BLACK),
      "H8": new Rook(Side.BLACK),
      "A7": new Pawn(Side.BLACK),
      "B7": new Pawn(Side.BLACK),
      "C7": new Pawn(Side.BLACK),
      "D7": new Pawn(Side.BLACK),
      "E7": new Pawn(Side.BLACK),
      "F7": new Pawn(Side.BLACK),
      "G7": new Pawn(Side.BLACK),
      "H7": new Pawn(Side.BLACK),
    })
  }

  static withPieces(pieces: { [square: string]: Piece }): ChessBoard {
    return new ChessBoard(pieces);
  }

  withMovedPiece(piece: Piece, from: Square, to: Square): MovePieceResult {
    const moveResult = this.movePieceHandler.handle(this, {piece, from, to});
    const lastMove = moveResult.moves[moveResult.moves.length - 1];
    return {...moveResult, board: moveResult.board.withLastMove(lastMove)}
  }

  afterMove(from: Square, to: Square): ChessBoard {
    const piece = this.pieceOn(from)!;
    return this.cloneBoard()
        .withoutPieceOn(from)
        .withPieceOn(to, piece)
        .withLastMove({from, to, piece});
  }

  withPieceOn(square: Square, piece: Piece | undefined): ChessBoard {
    const clone = this.cloneBoard();
    delete clone.pieces[square.algebraicNotation]
    if (piece) {
      clone.pieces[square.algebraicNotation] = piece
    }
    return clone;
  }

  withoutPieceOn(square: Square): ChessBoard {
    const clone = this.cloneBoard();
    delete clone.pieces[square.algebraicNotation]
    return clone;
  }

  withLastMove(lastMove: LastMove): ChessBoard {
    return this.cloneBoard(lastMove);
  }

  pieceOn(square: Square): Piece | undefined {
    return this.pieces[square.algebraicNotation];
  }

  squareOfKing(side: Side): Square | undefined {
    const found = this.squaresWith(new King(side));
    return found.length == 1 ? found[0] : undefined;
  }

  squaresWith(pieceToFind: Piece | PieceName): Square[] {
    return this.piecesOnSquares
        .filter(pieceOnSquare => pieceToFind instanceof Piece ? pieceOnSquare.piece.equals(pieceToFind) : pieceOnSquare.piece.name === pieceToFind)
        .map(pieceOnSquare => pieceOnSquare.square);
  }

  squareIsOccupied(square: Square): boolean {
    return this.pieceOn(square) !== undefined;
  }

  get piecesOnSquares(): PieceOnSquare[] {
    return Object.entries(this.pieces)
        .map(([algebraicSquare, pieceOnSquare]) => {
          return {piece: pieceOnSquare, square: Square.fromAlgebraicNotation(algebraicSquare)}
        });
  }

  isStalemateFor(side: Side): boolean {
    return !this.isKingChecked(side) && !this.canMoveOn(side);
  }

  canMoveOn(side: Side): boolean {
    return this.piecesOnSquares
        .filter(pieceWithSquare => pieceWithSquare.piece.side === side)
        .some(pieceWithSquare => pieceWithSquare.piece.canMove(this, pieceWithSquare.square));
  }

  isKingChecked(side?: Side): boolean {
    const checkedKing = this.checkedKing();
    return checkedKing !== undefined && (isNotDefined(side) || checkedKing.piece.side === side);
  }

  checkedKing(): { piece: King, square: Square } | undefined {
    const checkedKingOnSquare = this.piecesOnSquares
        .find(pieceWithSquare => isKing(pieceWithSquare.piece) && pieceWithSquare.piece.isInCheck(this, pieceWithSquare.square));
    return isNotDefined(checkedKingOnSquare) ? undefined : {
      piece: checkedKingOnSquare.piece as King,
      square: checkedKingOnSquare.square
    };
  }

  private cloneBoard(lastMove: LastMove | undefined = undefined): ChessBoard {
    return new ChessBoard({...this.pieces}, lastMove ? lastMove : this.lastMove);
  }

  get height(): number {
    return BOARD_SIZE;
  }

  get width(): number {
    return BOARD_SIZE;
  }
}

type MovePieceCommand = { piece: Piece, from: Square, to: Square };

abstract class MovePieceHandler {

  constructor(private readonly next?: MovePieceHandler) {
  }

  protected abstract handler(chessBoard: ChessBoard, command: MovePieceCommand): MovePieceResult

  handle(chessBoard: ChessBoard, props: MovePieceCommand): MovePieceResult {
    let result: MovePieceResult = this.handler(chessBoard, props);
    if (this.next) {
      const nextResult = this.next.handle(result.board, props);
      result = {board: nextResult.board, moves: [...result.moves, ...nextResult.moves]};
    }
    return result;
  }

}

class OrdinaryMovePieceHandler extends MovePieceHandler {

  handler(chessBoard: ChessBoard, command: MovePieceCommand): MovePieceResult {
    const captured = chessBoard.pieceOn(command.to);
    const board = chessBoard
        .withoutPieceOn(command.from)
        .withPieceOn(command.to, command.piece);
    const pieceMoved = {
      piece: command.piece,
      from: command.from,
      to: command.to,
      captured
    };
    return {board, moves: [pieceMoved]};
  }
}

class CastlingMovePieceHandler extends MovePieceHandler {

  handler(chessBoard: ChessBoard, command: MovePieceCommand): MovePieceResult {
    const castlingRook = isKing(command.piece) && this.castlingRook(chessBoard, command.from, command.to);
    if (!castlingRook) {
      return {board: chessBoard, moves: []};
    }
    const board = chessBoard
        .withoutPieceOn(castlingRook.from)
        .withPieceOn(castlingRook.to, castlingRook.rook);
    const rookMoved = {
      piece: castlingRook.rook,
      from: castlingRook.from,
      to: castlingRook.to
    };
    return {board, moves: [rookMoved]};
  }

  castlingRook(chessBoard: ChessBoard, from: Square, to: Square): { rook: Rook, from: Square, to: Square } | undefined {
    const kingMoveDiff = from.difference(to);
    const kingLongMoveOnTheSameRow = isDefined(kingMoveDiff.col) && kingMoveDiff.col == 2 || kingMoveDiff.col == -2;
    if (!kingLongMoveOnTheSameRow) {
      return undefined;
    }
    const isKingSide = kingMoveDiff.col == 2;

    const rookFrom = from.transform({col: isKingSide ? 3 : -4})!;
    const rookTo = rookFrom.transform({col: isKingSide ? -2 : 3})!;
    const rookPiece = chessBoard.pieceOn(rookFrom);
    return isRook(rookPiece) ? {rook: rookPiece, from: rookFrom, to: rookTo} : undefined;
  }


}

function isKing(piece: Piece | undefined): piece is King {
  return piece !== undefined && piece.name === "King";
}

function isRook(piece: Piece | undefined): piece is Rook {
  return piece !== undefined && piece.name === "Rook";
}



