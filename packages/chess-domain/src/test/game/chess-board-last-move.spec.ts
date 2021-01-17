import {Square} from "../../main/board/square";
import {blackPlayer, given, whitePlayer} from "./chess-game.event-assertions";
import {Pawn} from "../../main/pieces/pawn";
import {Side} from "../../main/pieces/side";

describe("Chess Game | Last move on Chess Board", () => {

  it("should be saved after each move", () => {
    given({
      board: {
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', '♟', ' ', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', '♟', ' ', '♙', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', '♙', '♙', ' ', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    }).whenCommand(
        game => {
          game.movePiece({by: whitePlayer, from: Square.fromAlgebraicNotation("E2"), to: Square.fromAlgebraicNotation("E4")});
          return game.movePiece({by: blackPlayer, from: Square.fromAlgebraicNotation("D4"), to: Square.fromAlgebraicNotation("E3")});
        }
    ).thenLastMove({from: Square.fromAlgebraicNotation("D4"), to: Square.fromAlgebraicNotation("E3"), piece: new Pawn(Side.BLACK)})
  });

});
