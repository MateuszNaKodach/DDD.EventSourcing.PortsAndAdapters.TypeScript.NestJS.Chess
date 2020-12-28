import { Square } from "../../main/board/square";
import {given, whitePlayer} from "./chess-game.event-assertions";
import { PieceWasMoved } from "../../main/event/piece-was-moved";
import {Pawn} from "../../main/pieces/pawn";
import {Side} from "../../main/pieces/side";

describe("Chess Game | Move piece - success with PieceWasMoved", () => {

  it("when to square is available then piece should be moved", () => {
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
    }).whenCommand(
      game => game.movePiece({ by: whitePlayer, from: Square.fromAlgebraicNotation("B2"), to: Square.fromAlgebraicNotation("B3") })
    ).thenEvent({
      type: PieceWasMoved,
      data: {
        piece: new Pawn(Side.WHITE),
        from: Square.fromAlgebraicNotation("B2"),
        to: Square.fromAlgebraicNotation("B3"),
        captured: undefined
      }
    });
  });

  it("when capture on to square then piece should be moved and enemy should be captured", () => {
    given({
      board: {
        8: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
        7: ["♟", "♟", " ", "♟", "♟", "♟", "♟", "♟"],
        6: [" ", " ", " ", " ", " ", " ", " ", " "],
        5: [" ", " ", " ", " ", " ", " ", " ", " "],
        4: [" ", " ", " ", " ", " ", " ", " ", " "],
        3: [" ", " ", "♟", " ", " ", " ", " ", " "],
        2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
        0: ["A", "B", "C", "D", "E", "F", "G", "H"]
      }
    }).whenCommand(
      game => game.movePiece({ by: whitePlayer, from: Square.fromAlgebraicNotation("B2"), to: Square.fromAlgebraicNotation("C3") })
    ).thenEvent({
      type: PieceWasMoved,
      data: {
        piece: new Pawn(Side.WHITE),
        from: Square.fromAlgebraicNotation("B2"),
        to: Square.fromAlgebraicNotation("C3"),
        captured: new Pawn(Side.BLACK)
      }
    });
  });


});
