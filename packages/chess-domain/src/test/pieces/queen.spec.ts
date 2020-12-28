import {Queen} from "../../main/pieces/queen";
import {Side} from "../../main/pieces/side";
import { EmojiChessBoardTestCase } from "../domain-test-dsl/board-spec.dsl";

describe('Queen', () => {

  const queenName = 'Queen';
  const whiteQueen = new Queen(Side.WHITE);
  const blackQueen = new Queen(Side.BLACK);

  it(`should be named ${queenName}`, () => {
    expect(whiteQueen.name).toBe(queenName);
    expect(blackQueen.name).toBe(queenName);
  });

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
      .whenPick({piece: "♕", on: "D1"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .and()
      .whenPick({piece: "♛", on: "D8"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .asTest("should not be available to move on start")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♕', ' ', ' ', ' ', ' '],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  })
      .whenPick({piece: "♕", on: "D4"})
      .thenNormalMoves([
        "A4", "B4", "C4", "E4", "F4", "G4", "H4",
        "D1", "D2", "D3", "D5", "D6", "D7", "D8",
        "A1", "B2", "C3", "E5", "F6", "G7", "H8",
        "A7", "B6", "C5", "E3", "F2", "G1"
      ]).thenAttackMoveIsNotAvailable()
      .asTest("should be available to move in all directions")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', '♟', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: ['♟', '♟', ' ', '♕', ' ', ' ', ' ', '♟'],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  })
      .whenPick({piece: "♕", on: "D4"})
      .thenNormalMoves([
        "C4", "E4", "F4", "G4",
        "D1", "D2", "D3", "D5",
        "A1", "B2", "C3", "E5", "F6", "G7", "H8",
        "A7", "B6", "C5", "E3", "F2", "G1"
      ]).thenAttackMoves(["B4", "D6", "H4"])
      .asTest("should not skip enemy chess")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', '♟', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: ['♟', '♟', ' ', '♕', ' ', ' ', ' ', '♟'],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).thenExpectMoves({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', '👟'],
    7: ['👟', ' ', ' ', ' ', ' ', ' ', '👟', ' '],
    6: [' ', '👟', ' ', '🗡️', ' ', '👟', ' ', ' '],
    5: [' ', ' ', '👟', '👟', '👟', ' ', ' ', ' '],
    4: [' ', '🗡️', '👟', '♕', '👟', '👟', '👟', '🗡️'],
    3: [' ', ' ', '👟', '👟', '👟', ' ', ' ', ' '],
    2: [' ', '👟', ' ', '👟', ' ', '👟', ' ', ' '],
    1: ['👟', ' ', ' ', '👟', ' ', ' ', '👟', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).asTest("should not skip enemy chess")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '♟', '♟', '♟', ' ', ' ', ' '],
    4: [' ', ' ', '♟', '♕', '♟', ' ', ' ', ' '],
    3: [' ', ' ', '♟', '♟', '♟', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  })
      .whenPick({piece: "♕", on: "D4"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoves(["C3", "C4", "C5", "D3", "D5", "E3", "E4", "E5"])
      .asTest("should be available to attack in all directions")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '♟', '♟', '♟', ' ', ' ', ' '],
    4: [' ', ' ', '♟', '♕', '♟', ' ', ' ', ' '],
    3: [' ', ' ', '♟', '♟', '♟', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).thenExpectMoves({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '🗡️', '🗡️', '🗡️', ' ', ' ', ' '],
    4: [' ', ' ', '🗡️', '♕', '🗡️', ' ', ' ', ' '],
    3: [' ', ' ', '🗡️', '🗡️', '🗡️', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).asTest("should be available to attack in all directions")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: ['♟', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: [' ', '♟', ' ', '♕', ' ', ' ', ' ', ' '],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  })
      .whenPick({piece: "♕", on: "D4"})
      .thenAttackMoves(["B4", "A7"])
      .asTest("should be available to attack in all directions when enemy chess is not on next square")


});
