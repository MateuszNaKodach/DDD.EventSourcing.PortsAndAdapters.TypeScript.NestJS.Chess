import {given, whitePlayer} from "./chess-game.event-assertions";
import { Square } from "../../main/board";
import {Side} from "../../main/pieces";
import { KingWasChecked } from "../../main/event";
import {King} from "../../main/pieces";
import {ChessGame} from "../../main/game";

describe("Chess Game | Move piece - success with KingWasChecked", () => {

  it("when make move after which attack on king is available then king should be checked", () => {
    given({
      board: {
        8: ["♜", "♞", "♝", "♛", " ", "♝", "♞", "♜"],
        7: ["♟", "♟", " ", "♟", "♟", "♟", "♟", "♟"],
        6: [" ", " ", " ", " ", " ", " ", " ", " "],
        5: [" ", " ", " ", " ", " ", " ", " ", " "],
        4: [" ", " ", " ", "♚", " ", " ", " ", " "],
        3: [" ", " ", "♟", " ", " ", " ", " ", " "],
        2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
        0: ["A", "B", "C", "D", "E", "F", "G", "H"]
      }
    }).whenCommand(
        (game: ChessGame) => game.movePiece({ by: whitePlayer, from: Square.fromAlgebraicNotation("B2"), to: Square.fromAlgebraicNotation("C3") })
    ).thenEvent({
      type: KingWasChecked,
      data: {
        onSquare: Square.fromAlgebraicNotation("D4"),
        king: new King(Side.BLACK)
      }
    });
  });

});
