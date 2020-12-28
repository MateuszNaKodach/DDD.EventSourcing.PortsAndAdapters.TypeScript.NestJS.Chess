import {blackPlayer, given, whitePlayer} from "./chess-game.event-assertions";
import { Square } from '../../main/board';
import {Side} from '../../main/pieces';
import {King} from '../../main/pieces';
import { KingWasUnchecked } from "../../main/event";
import {Rook} from '../../main/pieces';
import {Pawn} from '../../main/pieces';

describe("Chess Game | Move piece - success with KingWasUnchecked", () => {

  it("when make move after which attack on king is impossible then king should be unchecked", () => {
    given({
      board: {
        8: [" ", "♞", "♝", "♛", " ", "♝", "♞", "♜"],
        7: [" ", "♟", " ", "♟", "♟", "♟", "♟", "♟"],
        6: [" ", " ", " ", " ", " ", " ", " ", " "],
        5: [" ", " ", "♜", " ", " ", " ", " ", " "],
        4: [" ", " ", " ", "♚", " ", " ", " ", " "],
        3: [" ", " ", "♟", " ", " ", " ", " ", " "],
        2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
        0: ["A", "B", "C", "D", "E", "F", "G", "H"]
      }
    }).whenCommand(
      game => {
        game.movePiece({ by: whitePlayer, from: Square.fromAlgebraicNotation("B2"), to: Square.fromAlgebraicNotation("C3") });
        return game.movePiece({ by: blackPlayer, from: Square.fromAlgebraicNotation("C5"), to: Square.fromAlgebraicNotation("C3") });
      }
    ).thenEvent({
      type: KingWasUnchecked,
      data: {
        onSquare: Square.fromAlgebraicNotation("D4"),
        king: new King(Side.BLACK),
        afterMove: {
          piece: new Rook(Side.BLACK),
          from: Square.fromAlgebraicNotation("C5"),
          to: Square.fromAlgebraicNotation("C3"),
          captured: new Pawn(Side.WHITE)
        }
      }
    });
  });

});
