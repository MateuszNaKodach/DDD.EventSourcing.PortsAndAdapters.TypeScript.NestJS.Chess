import { Square } from "../../main/board/square";
import {blackPlayer, given, whitePlayer} from "./chess-game.event-assertions";
import {Pawn} from "../../main/pieces/pawn";
import {Side} from "../../main/pieces/side";
import { PieceWasCaptured } from "../../main/event/piece-was-captured";

describe("Chess Game | Move piece - success with PieceWasCaptured", () => {

  it("when capture on to square then enemy piece should be captured", () => {
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
      type: PieceWasCaptured,
      data: {
        onSquare: Square.fromAlgebraicNotation("C3"),
        piece: new Pawn(Side.BLACK),
        byMove: {
          piece: new Pawn(Side.WHITE),
          from: Square.fromAlgebraicNotation("B2"),
          to: Square.fromAlgebraicNotation("C3")
        }
      }
    });
  });


  it("Pawn en passant capture", () => {
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
    ).thenEvent({
      type: PieceWasCaptured,
      data: {
        onSquare: Square.fromAlgebraicNotation("E4"),
        piece: new Pawn(Side.WHITE),
        byMove: {
          piece: new Pawn(Side.BLACK),
          from: Square.fromAlgebraicNotation("D4"),
          to: Square.fromAlgebraicNotation("E3")
        }
      }
    });
  });

});
