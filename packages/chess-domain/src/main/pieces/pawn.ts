import {canCapturePiece, MoveDelta, Piece} from "./piece";
import {Side} from "./side";
import {ChessBoard, Square} from "../board";

export class Pawn extends Piece {

  constructor(side: Side) {
    super(side);
  }

  getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return pawnPattern(this.side, chessBoard, currentSquare)
  }

  isOnTheOppositeEdgeOfTheBoard(currentSquare: Square): boolean {
    return currentSquare.row.number === (this.isWhite() ? 8 : 1);
  }

  static isPawn(piece: Piece): piece is Pawn {
    return piece.name === "Pawn";
  }

}

function pawnPattern(side: Side, chessBoard: ChessBoard, currentSquare: Square): Square[] {
  const delta = side === Side.WHITE ? 1 : -1
  const normalMovesPattern = pawnOnStartingRow(side, currentSquare) ? [
    {
      column: 0,
      row: delta
    },
    {
      column: 0,
      row: delta * 2
    }
  ] : [
    {
      column: 0,
      row: delta
    }
  ];
  const captureMovesPattern = [
    {
      column: 1,
      row: delta
    },
    {
      column: -1,
      row: delta
    }
  ];
  const normalMoves = pawnNormalMoves(chessBoard, currentSquare, normalMovesPattern)
  const captureMoves = pawnCaptureMoves(side, currentSquare, chessBoard, captureMovesPattern);
  const enPassantCaptureMoves = pawnEnPassantCaptureMoves(side, currentSquare, chessBoard);
  return [...normalMoves, ...captureMoves, ...enPassantCaptureMoves];
}

function pawnCaptureMoves(side: Side, currentSquare: Square, chessBoard: ChessBoard, [firstMove, ...otherMoves]: MoveDelta[]): Square[] {
  if (!firstMove) {
    return []
  }
  const moveSquare = currentSquare.transform({col: firstMove.column, row: firstMove.row})
  return moveSquare && canCapturePiece(side, chessBoard, moveSquare)
      ? [moveSquare, ...pawnCaptureMoves(side, currentSquare, chessBoard, otherMoves)]
      : pawnCaptureMoves(side, currentSquare, chessBoard, otherMoves)
}

function pawnNormalMoves(chessBoard: ChessBoard, currentSquare: Square, [firstMove, ...otherMoves]: MoveDelta[]): Square[] {
  if (!firstMove) {
    return []
  }
  const moveSquare = currentSquare.transform({col: firstMove.column, row: firstMove.row})

  if (!moveSquare || isPawnObstruction(chessBoard, moveSquare)) {
    return []
  }
  return [moveSquare, ...pawnNormalMoves(chessBoard, currentSquare, otherMoves)]
}

function isPawnObstruction(chessBoard: ChessBoard, square: Square): boolean {
  const pieceOnSquare = chessBoard.pieceOn(square)
  return pieceOnSquare !== undefined
}

function pawnOnStartingRow(side: Side, currentSquare: Square): boolean {
  if (side === Side.WHITE) {
    return currentSquare.row.number === 2;
  } else if (side === Side.BLACK) {
    return currentSquare.row.number === 7;
  } else {
    return false;
  }
}

function pawnEnPassantCaptureMoves(side: Side, currentSquare: Square, chessBoard: ChessBoard): Square[] {
  const lastMove = chessBoard.lastMove;
  if (!lastMove) {
    return [];
  }
  const enPassantAvailable = lastMove.piece.name === "Pawn"
      && lastMove.piece.side !== side
      && Math.abs(lastMove.from.row.number - lastMove.to.row.number) == 2
      && Math.abs(currentSquare.column.number - lastMove.to.column.number) == 1;

  if (!enPassantAvailable) {
    return [];
  }
  const enPassantCaptureSquare = Square.fromAlgebraicNotation(lastMove.to.algebraicNotation).transform({row: lastMove.piece.isWhite() ? -1 : 1});
  return enPassantCaptureSquare ? [enPassantCaptureSquare] : [];
}
