import {ChessBoard} from "./chess-board";

export interface ChessBoardGenerator {
  generate(): ChessBoard;
}

