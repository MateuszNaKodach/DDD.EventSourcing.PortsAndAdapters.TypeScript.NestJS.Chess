import {lineMoves, Piece} from "./piece";
import {ChessBoard, Square} from "../board";
import {Side} from "./side";

export class Rook extends Piece {

  constructor(side: Side) {
    super(side);
  }

  getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return [
      ...lineMoves(this.side, chessBoard, currentSquare, {row: -1}),
      ...lineMoves(this.side, chessBoard, currentSquare, {row: 1}),
      ...lineMoves(this.side, chessBoard, currentSquare, {col: -1}),
      ...lineMoves(this.side, chessBoard, currentSquare, {col: 1})
    ]
  }

}
