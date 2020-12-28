import {Pawn} from "../../main/pieces";
import {Side} from "../../main/pieces";
import {EmojiChessBoardTestCase} from "../domain-test-dsl/board-spec.dsl";

describe('Pawn', () => {

  const pawnName = 'Pawn';
  const whitePawn = new Pawn(Side.WHITE);
  const blackPawn = new Pawn(Side.BLACK);

  describe('♙ white pawns', () => {

    it(`should be named ${pawnName}`, () => {
      expect(whitePawn.name).toBe(pawnName);
    });

    it(`should be on ${Side.WHITE} side`, () => {
      expect(whitePawn.side).toBe(Side.WHITE);
    });

    it("should be available to move one or two squares up if have not already moved", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♙", on: "A2"})
          .thenNormalMoves(["A3", "A4"])
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

    it("should be available to move only one square up if have already moved", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', ' ', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', '♟', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', '♙', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', ' ', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♙", on: "B3"})
          .thenNormalMoves(["B4"])
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

    it("cannot move at the top of the board", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♙', ' ', '♛', '♚', '♝', '♞', '♜'],
        7: [' ', ' ', ' ', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', '♟', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', ' ', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♙", on: "B8"})
          .thenNormalMoveIsNotAvailable()
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

    it("can move diagonally if there is a piece to attack", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', ' ', '♟', '♟', '♟', ' ', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: ['♟', ' ', '♟', ' ', ' ', ' ', ' ', ' '],
        3: [' ', '♙', ' ', ' ', ' ', ' ', '♟', ' '],
        2: ['♙', ' ', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♙", on: "B3"})
          .thenNormalMoves(["B4"])
          .thenAttackMoves(["A4", "C4"])
          .and()
          .whenPick({piece: "♙", on: "F2"})
          .thenNormalMoves(["F3", "F4"])
          .thenAttackMoves(["G3"])
          .assert();
    })

    it("can move diagonally if there is a piece to attack and straight if square is not occuppied", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', ' ', '♟', '♟', '♟', ' ', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: ['♟', ' ', '♟', ' ', ' ', ' ', ' ', ' '],
        3: [' ', '♙', ' ', ' ', ' ', ' ', '♟', ' '],
        2: ['♙', ' ', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).thenExpectMoves({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: ['🗡️', '👟', '🗡️', ' ', ' ', ' ', ' ', ' '],
        3: [' ', '♙', ' ', ' ', ' ', ' ', ' ', ' '],
        2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).assert();
    })

    it("should not be available to move two squares up if another piece is in front of pawn if have not already moved", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', ' ', '♟', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', '♙', ' ', ' ', ' ', ' '],
        3: [' ', '♟', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', ' ', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♙", on: "B2"})
          .thenNormalMoveIsNotAvailable()
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

  });

  describe('♟ black pawns', () => {

    it(`should be named ${pawnName}`, () => {
      expect(blackPawn.name).toBe(pawnName);
    });

    it(`should be on ${Side.BLACK} side`, () => {
      expect(blackPawn.side).toBe(Side.BLACK);
    });


    it("should be available to move one or two squares down if have not already moved", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♟", on: "E7"})
          .thenNormalMoves(["E6", "E5"])
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

    it("should be available to move only one square down if have already moved", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', '♟', '♟', ' ', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', '♟', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♟", on: "E6"})
          .thenNormalMoves(["E5"])
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

    it("cannot move at the bottom of the board", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♙', ' ', '♛', '♚', '♝', '♞', '♜'],
        7: [' ', ' ', ' ', '♟', '♟', ' ', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', ' ', ' ', ' ', ' ', '♙', ' ', '♙'],
        1: ['♖', ' ', '♟', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♟", on: "C1"})
          .thenNormalMoveIsNotAvailable()
          .thenAttackMoveIsNotAvailable()
          .assert();
    })

    it("can move diagonally if there is a piece to attack", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', ' ', '♟', '♟', '♟', ' ', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: ['♟', ' ', '♟', ' ', ' ', ' ', ' ', ' '],
        3: [' ', '♙', ' ', ' ', ' ', ' ', '♟', ' '],
        2: ['♙', ' ', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      })
          .whenPick({piece: "♟", on: "C4"})
          .thenNormalMoves(["C3"])
          .thenAttackMoves(["B3"])
          .and()
          .whenPick({piece: "♟", on: "A4"})
          .thenNormalMoves(["A3"])
          .thenAttackMoves(["B3"])
          .assert();
    })
  });

});



