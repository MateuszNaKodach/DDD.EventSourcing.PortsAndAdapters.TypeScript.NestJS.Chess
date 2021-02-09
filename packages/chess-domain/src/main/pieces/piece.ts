import {Side} from "./side";
import {MoveType, PieceMove} from "./piece-move";
import {ChessBoard, Square, TransformParams} from "../board";
import {PieceName} from "./piece-name";

export abstract class Piece {

  readonly side: Side;

  protected constructor(side: Side) {
    this.side = side;
  }

  protected abstract getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[]

  getAvailableMoves(chessBoard: ChessBoard, currentSquare: Square): PieceMove[] {
    return this.getPiecePatternMoves(chessBoard, currentSquare)
      .filter(this.cannotExposeKingOnAttack(chessBoard, currentSquare));
  }

  protected getPiecePatternMoves(chessBoard: ChessBoard, currentSquare: Square): PieceMove[] {
    return this.getPatternSquares(chessBoard, currentSquare)
        .map(moveSquare => this.toPieceMove(chessBoard)(moveSquare));
  }

  canMove(chessBoard: ChessBoard, currentSquare: Square): boolean {
    return this.getAvailableMoves(chessBoard, currentSquare).length > 0;
  }

  getAttackMoves(chessBoard: ChessBoard, currentSquare: Square): PieceMove[] {
    return this.getAvailableMoves(chessBoard, currentSquare)
      .filter(it => it.type == MoveType.ATTACK);
  }

  getAttackSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return this.getAttackMoves(chessBoard, currentSquare)
      .map(it => it.square);
  }

  getNonAttackMoves(chessBoard: ChessBoard, currentSquare: Square): PieceMove[] {
    return this.getAvailableMoves(chessBoard, currentSquare)
      .filter(it => it.type !== MoveType.ATTACK);
  }

  canAttackOn(chessBoard: ChessBoard, currentSquare: Square, squareToAttack: Square): boolean {
    return this.getAttackSquares(chessBoard, currentSquare)
      .some(it => it.equals(squareToAttack));
  }

  withinPatternOn(chessBoard: ChessBoard, currentSquare: Square, squareToAttack: Square): boolean {
    return this.getPatternSquares(chessBoard, currentSquare)
      .some(it => it.equals(squareToAttack));
  }

  get name(): PieceName {
    return this.constructor.name as PieceName;
  }

  isWhite(): boolean {
    return this.side === Side.WHITE;
  }

  isBlack(): boolean {
    return this.side === Side.BLACK;
  }

  isOpponentOf(anotherPiece: Piece): boolean {
    return this.side !== anotherPiece.side;
  }

  protected canAttackOnSquare(chessBoard: ChessBoard, square: Square): boolean {
    return chessBoard.squareIsOccupied(square) && chessBoard.pieceOn(square)!.isOpponentOf(this);
  };

  protected toPieceMove(chessBoard: ChessBoard): (movableSquare: Square) => PieceMove {
    return (movableSquare: Square) =>
      this.canAttackOnSquare(chessBoard, movableSquare) ? PieceMove.attackAt(movableSquare) : PieceMove.normalAt(movableSquare);
  }

  equals(anotherPiece: Piece | undefined): boolean {
    return anotherPiece !== undefined && anotherPiece.side === this.side && anotherPiece.name === this.name;
  }

  protected cannotExposeKingOnAttack(chessBoard: ChessBoard, currentSquare: Square): (it: PieceMove) => boolean {
    return (it: PieceMove) => {
      const squareAfterMove = it.square;
      const chessBoardAfterMove = chessBoard.afterMove(currentSquare, squareAfterMove);
      const allyKingAfterMoveSquare = chessBoardAfterMove.squareOfKing(this.side);
      return allyKingAfterMoveSquare ? !withinEnemyPatternMoves(this.side, chessBoardAfterMove, allyKingAfterMoveSquare) : true;
    };
  }

}

export type MoveDelta = { column: number, row: number }

function withinEnemyPatternMoves(side: Side, chessBoard: ChessBoard, onSquare: Square): boolean {
  return chessBoard.piecesOnSquares
      .filter(pieceOnSquare => pieceOnSquare.piece.side !== side)
      .some(pieceOnSquare => pieceOnSquare.piece.withinPatternOn(chessBoard, pieceOnSquare.square, onSquare))
}

export function patternMoves(side: Side, chessBoard: ChessBoard, fromSquare: Square, [firstMove, ...otherMoves]: MoveDelta[]): Square[] {
  if (!firstMove) {
    return []
  }
  const moveSquare = fromSquare.transform({col: firstMove.column, row: firstMove.row})
  if (!moveSquare || isObstruction(side, chessBoard, moveSquare)) {
    return patternMoves(side, chessBoard, fromSquare, otherMoves);
  }
  return [moveSquare, ...patternMoves(side, chessBoard, fromSquare, otherMoves)]
}

export function lineMoves(side: Side, chessBoard: ChessBoard, fromSquare: Square, vector: TransformParams): Square[] {
  const nextSquare = fromSquare.transform(vector)
  if (!nextSquare) {
    return []
  }
  if (nextSquare && canCapturePiece(side, chessBoard, nextSquare)) {
    return [nextSquare];
  }
  if (nextSquare && isObstruction(side, chessBoard, nextSquare)) {
    return [];
  }
  return [nextSquare, ...lineMoves(side, chessBoard, nextSquare, vector)];
}

export function canCapturePiece(side: Side, chessBoard: ChessBoard, square: Square): boolean {
  const pieceOnSquare = chessBoard.pieceOn(square)
  return pieceOnSquare !== undefined && pieceOnSquare.side !== side
}

function isObstruction(side: Side, chessBoard: ChessBoard, square: Square): boolean {
  const pieceOnSquare = chessBoard.pieceOn(square)
  return pieceOnSquare !== undefined && pieceOnSquare.side === side
}
