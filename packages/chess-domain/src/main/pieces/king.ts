import {MoveDelta, patternMoves, Piece} from "./piece";
import {Side} from "./side";
import {ChessBoard, PieceOnSquare, Square} from "../board";
import {PieceMove} from "./piece-move";
import {Rook} from "./rook";

export class King extends Piece {

  static MOVES_PATTERN: MoveDelta[] = [
    {
      column: -1,
      row: -1
    },
    {
      column: -1,
      row: 0
    },
    {
      column: -1,
      row: 1
    },
    {
      column: 0,
      row: 1
    },
    {
      column: 1,
      row: 1
    },
    {
      column: 1,
      row: 0
    },
    {
      column: 1,
      row: -1
    },
    {
      column: 0,
      row: -1
    },
  ];

  constructor(side: Side) {
    super(side);
  }

  getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return patternMoves(this.side, chessBoard, currentSquare, King.MOVES_PATTERN);
  }

  getAvailableMoves(chessBoard: ChessBoard, currentSquare: Square): PieceMove[]{
    return this.getPatternSquares(chessBoard, currentSquare)
        .map(moveSquare => this.toPieceMove(chessBoard)(moveSquare))
        .filter(this.cannotExposeKingOnAttack(chessBoard, currentSquare))
        .concat(castlingPattern(this.side, chessBoard, currentSquare).map(moveSquare => this.toPieceMove(chessBoard)(moveSquare)))
  }

  isInCheck(chessBoard: ChessBoard, currentSquare: Square): boolean {
    return isKingInCheck(this.side, chessBoard, currentSquare)
  }

  isCheckmate(chessBoard: ChessBoard, currentSquare: Square): boolean {
    return this.isInCheck(chessBoard, currentSquare) && !chessBoard.canMoveOn(this.side)
  }
}

export function castlingPattern(side: Side, chessBoard: ChessBoard, currentSquare: Square): Square[] {
  const result: Square[] = []
  if (kingHasMoved(side, chessBoard)) {
    return []
  }
  if (notMovedRookOnQueenSide(side, chessBoard) && queenSideSquaresEmpty(currentSquare, chessBoard) && !queenSideInCheck(currentSquare, chessBoard)) {
    result.push(currentSquare.transform({col: -2})!)
  }
  if (notMovedRookOnKingSide(side, chessBoard) && kingSideSquaresEmpty(currentSquare, chessBoard) && !kingSideInCheck(currentSquare, chessBoard)) {
    result.push(currentSquare.transform({col: +2})!)
  }
  return result;
}

function queenSideInCheck(kingSquare: Square, chessBoard: ChessBoard): boolean {
  return [{col: 0}, {col: -1}, {col: -2}]
      .map(it => kingSquare.transform(it))
      .some(it => it && chessBoard.afterMove(kingSquare, it).isKingChecked())
}

function kingSideInCheck(kingSquare: Square, chessBoard: ChessBoard): boolean {
  return [{col: 0}, {col: +1}, {col: +2}]
      .map(it => kingSquare.transform(it))
      .some(it => it && chessBoard.afterMove(kingSquare, it).isKingChecked())
}

function notMovedRookOnQueenSide(side: Side, chessBoard: ChessBoard): Square | undefined {
  const rookSquares = chessBoard.squaresWith(new Rook(side))
  return rookSquares.find(it => it.algebraicNotation === (side === Side.WHITE ? "A1" : "A8"))
}

function queenSideSquaresEmpty(kingSquare: Square, chessBoard: ChessBoard): boolean {
  return [{col: -1}, {col: -2}, {col: -3}]
      .map(it => kingSquare.transform(it))
      .every(it => it && !chessBoard.squareIsOccupied(it))
}

function kingSideSquaresEmpty(kingSquare: Square, chessBoard: ChessBoard): boolean {
  return [{col: 1}, {col: 2}]
      .map(it => kingSquare.transform(it))
      .every(it => it && !chessBoard.squareIsOccupied(it))
}

function notMovedRookOnKingSide(side: Side, chessBoard: ChessBoard): Square | undefined {
  const rookSquares = chessBoard.squaresWith(new Rook(side))
  return rookSquares.find(it => it.algebraicNotation === (side === Side.WHITE ? "H1" : "H8"))
}

function kingHasMoved(side: Side, chessBoard: ChessBoard) {
  const kingSquare = chessBoard.squareOfKing(side);
  const kingStartingSquare = Square.fromAlgebraicNotation(side === Side.WHITE ? "E1" : "E8");
  return !kingSquare || !kingSquare.equals(kingStartingSquare);
}

/**
 * Jeśli król jest atakowany przez bierkę (bierki) przeciwnika, mówi się, że jest w szachu lub jest szachowany.
 * W takiej sytuacji gracz ma obowiązek bronić króla (nie może wykonać innego ruchu) przez przesunięcie go na inne pole,
 * zbicie atakującej bierki przeciwnika lub przesłonięcie ataku własną bierką.
 * W odróżnieniu od innych bierek król nie może szachować króla przeciwnika.
 * @param side - strona dla której należy sprawdzić czy król jest szachowany
 * @param chessBoard - stan szachownicy do sprawdzenia czy król jest na niej szachowany
 * @param kingSquare - pole, na którym stoi aktualnie król
 */
function isKingInCheck(side: Side, chessBoard: ChessBoard, kingSquare: Square): boolean {
  const isNotKing = (pieceOnSquare: PieceOnSquare) => pieceOnSquare.piece.name !== "King";
  const isEnemyPiece = (pieceOnSquare: PieceOnSquare) => pieceOnSquare.piece.side !== side;
  const isStandingOnAnotherPieceAttackSquare = (pieceOnSquare: PieceOnSquare) =>
      pieceOnSquare.piece.canAttackOn(chessBoard, pieceOnSquare.square, kingSquare);

  return chessBoard.piecesOnSquares
      .filter(isEnemyPiece)
      .filter(isNotKing)
      .some(isStandingOnAnotherPieceAttackSquare)
}
