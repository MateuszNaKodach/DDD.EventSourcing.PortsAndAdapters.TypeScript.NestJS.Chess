import {lineMoves, Piece} from "./piece";
import {Side} from "./side";
import {ChessBoard, Square} from "../board";

export class Bishop extends Piece {

  constructor(side: Side) {
    super(side);
  }

  getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return [
      ...lineMoves(this.side, chessBoard, currentSquare, {row: -1, col: -1}),
      ...lineMoves(this.side, chessBoard, currentSquare, {row: -1, col: 1}),
      ...lineMoves(this.side, chessBoard, currentSquare, {row: 1, col: 1}),
      ...lineMoves(this.side, chessBoard, currentSquare, {row: 1, col: -1})
    ]
  }

}
