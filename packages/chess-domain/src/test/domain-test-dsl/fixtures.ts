import {ChessBoard} from "../../main/board";
import { EmojiConfiguration } from "@ddd-es-ts-chess/chess-piece-emoji";
import { TestChessBoardGenerator } from "./test-chess-board-generator";

/*
Fixtures są to gotowe stany początkowe używane do testów.
 */

export function board(config: EmojiConfiguration): ChessBoard {
  return new TestChessBoardGenerator(config).generate();
}
