import { EmojiChessBoardTestCase } from "../domain-test-dsl/board-spec.dsl";
import {Side} from "../../main/pieces/side";

describe("Stalemate", () => {


  describe("when none piece can move", () => {

    EmojiChessBoardTestCase.givenChessBoard({
      8: [' ', ' ', ' ', '♚', ' ', ' ', ' ', ' '],
      7: [' ', ' ', ' ', '♙', ' ', ' ', ' ', ' '],
      6: [' ', ' ', ' ', '♔', ' ', ' ', ' ', ' '],
      5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }).testStalemate(Side.BLACK)

    EmojiChessBoardTestCase.givenChessBoard({
      8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      5: [' ', ' ', '♜', '♜', ' ', ' ', ' ', ' '],
      4: [' ', ' ', ' ', ' ', '♔', ' ', ' ', ' '],
      3: [' ', ' ', ' ', ' ', ' ', '♜', ' ', '♜'],
      2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }).testStalemate(Side.WHITE)

  })

})
