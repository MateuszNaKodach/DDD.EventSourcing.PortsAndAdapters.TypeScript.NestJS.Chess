import {canCapturePiece, MoveDelta, Piece} from "./piece";
import {Side} from "./side";
import {ChessBoard, Square} from "../board";
import {PieceMove} from "./piece-move";

export class Pawn extends Piece {

  constructor(side: Side) {
    super(side);
  }

  getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return pawnPattern(this.side, chessBoard, currentSquare)
  }

  protected getPiecePatternMoves(chessBoard: ChessBoard, currentSquare: Square): PieceMove[] {
    const patternSquaresMoves = super.getPiecePatternMoves(chessBoard, currentSquare);
    const enPassantCaptureSquares = pawnEnPassantCaptureMoves(this.side, currentSquare, chessBoard);
    const enPassantAttackMoves = enPassantCaptureSquares.map(square => PieceMove.attackAt(square))
    return patternSquaresMoves.concat(enPassantAttackMoves);
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
  return [...normalMoves, ...captureMoves];
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

/**
 * TODO: Extract this logic somehow
 * https://www.chess.com/pl/article/view/bicie-w-przelocie-specjalne-ruchy-w-szachach
 * https://en.wikipedia.org/wiki/En_passant
 */
function pawnEnPassantCaptureMoves(side: Side, currentSquare: Square, chessBoard: ChessBoard): Square[] {
  const lastMove = chessBoard.lastMove;
  if (!lastMove) {
    return [];
  }
  const enPassantAvailable = lastMove.piece.name === "Pawn"
      && lastMove.piece.side !== side
      && Math.abs(lastMove.from.row.number - lastMove.to.row.number) == 2
      && Math.abs(currentSquare.column.number - lastMove.to.column.number) == 1
      && Math.abs(currentSquare.row.number - lastMove.to.row.number) == 0;

  if (!enPassantAvailable) {
    return [];
  }
  const enPassantCaptureSquare = Square.fromAlgebraicNotation(lastMove.to.algebraicNotation).transform({row: lastMove.piece.isWhite() ? -1 : 1});
  return enPassantCaptureSquare ? [enPassantCaptureSquare] : [];
}
