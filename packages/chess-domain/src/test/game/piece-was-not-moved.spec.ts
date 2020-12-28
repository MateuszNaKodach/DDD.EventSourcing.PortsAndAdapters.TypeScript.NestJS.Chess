import {given, whitePlayer} from "./chess-game.event-assertions";
import {Square} from "../../main/board";
import {PieceWasNotMoved} from "../../main/event";

describe("Chess Game | Move piece - failure with PieceWasNotMoved", () => {

  it("when to square is not available then piece should not be moved", () => {
    given({
      board: {
        8: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
        7: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
        6: [" ", " ", " ", " ", " ", " ", " ", " "],
        5: [" ", " ", " ", " ", " ", " ", " ", " "],
        4: [" ", " ", " ", " ", " ", " ", " ", " "],
        3: [" ", " ", " ", " ", " ", " ", " ", " "],
        2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
        0: ["A", "B", "C", "D", "E", "F", "G", "H"]
      }
    })
        .whenCommand(chessGame => chessGame.movePiece({
          by: whitePlayer,
          from: Square.fromAlgebraicNotation("B2"),
          to: Square.fromAlgebraicNotation("B5")
        }))
        .thenEvent({
              type: PieceWasNotMoved,
              data: {
                from: Square.fromAlgebraicNotation("B2"),
                to: Square.fromAlgebraicNotation("B5"),
                reason: "Selected square is not available for the piece!"
              }
            }
        );
  });

})
