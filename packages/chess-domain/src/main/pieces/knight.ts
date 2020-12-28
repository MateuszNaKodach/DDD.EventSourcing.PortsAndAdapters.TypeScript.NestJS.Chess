import {MoveDelta, patternMoves, Piece} from "./piece";

import {Square} from "../board";
import {ChessBoard} from "../board";
import {Side} from "./side";

export class Knight extends Piece {

  static MOVES_PATTERN: MoveDelta[] = [
    {
      column: 2,
      row: 1
    },
    {
      column: 1,
      row: 2
    },
    {
      column: 1,
      row: -2
    },
    {
      column: 2,
      row: -1
    },
    {
      column: -2,
      row: 1
    },
    {
      column: -1,
      row: 2
    },
    {
      column: -1,
      row: -2
    },
    {
      column: -2,
      row: -1
    }
  ];

  constructor(side: Side) {
    super(side);
  }

  getPatternSquares(chessBoard: ChessBoard, currentSquare: Square): Square[] {
    return patternMoves(this.side, chessBoard, currentSquare, Knight.MOVES_PATTERN);
  }
}
