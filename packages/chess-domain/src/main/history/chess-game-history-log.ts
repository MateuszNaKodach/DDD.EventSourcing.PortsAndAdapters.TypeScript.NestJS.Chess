import {Side} from "../pieces/side";
import {ChessBoard} from "../board/chess-board";
import { Square } from "../board/square";
import {Piece} from "../pieces/piece";

export class ChessGameHistoryLog {

  private constructor(private readonly gameHistory: ChessGameHistoryEntry[]) {
  }

  static empty(): ChessGameHistoryLog {
    return new ChessGameHistoryLog([]);
  }

  record(entry: ChessGameHistoryEntry): ChessGameHistoryLog {
    return new ChessGameHistoryLog([...this.gameHistory, entry]);
  }

  last(): ChessGameHistoryEntry | undefined {
    return [...this.gameHistory].pop();
  }

  forgetLast(): ChessGameHistoryLog {
    const after = [...this.gameHistory];
    after.pop();
    return new ChessGameHistoryLog(after);
  }
}

export type ChessGameHistoryEntry = {
  readonly currentSide: Side
  readonly chessBoard: ChessBoard
  readonly timestamp: Date,
  readonly checkedKing?: {
    readonly square: Square,
    readonly piece: Piece
  }
}

