import {Bishop, Side} from "../../main/pieces";
import {EmojiChessBoardTestCase} from "../domain-test-dsl/board-spec.dsl";

describe('Bishop', () => {
  const bishopName = 'Bishop';
  const whiteBishop = new Bishop(Side.WHITE);
  const blackBishop = new Bishop(Side.BLACK);

  it(`should be named ${bishopName}`, () => {
    expect(whiteBishop.name).toBe(bishopName);
    expect(blackBishop.name).toBe(bishopName);
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
      .whenPick({piece: "♗", on: "C1"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .and()
      .whenPick({piece: "♗", on: "F1"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .and()
      .whenPick({piece: "♝", on: "C8"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .and()
      .whenPick({piece: "♝", on: "F8"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .asTest("should not be available to move on start")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '♟', ' ', '♟', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♗', ' ', ' ', ' ', ' '],
    3: [' ', ' ', '♟', ' ', '♟', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).thenExpectMoves({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '🗡️', ' ', '🗡️', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♗', ' ', ' ', ' ', ' '],
    3: [' ', ' ', '🗡️', ' ', '🗡️', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).asTest("should not skip enemy chess and attack on diagonals")

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♗', ' ', ' ', ' ', ' '],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).thenExpectMoves({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', '👟'],
    7: ['👟', ' ', ' ', ' ', ' ', ' ', '👟', ' '],
    6: [' ', '👟', ' ', ' ', ' ', '👟', ' ', ' '],
    5: [' ', ' ', '👟', ' ', '👟', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♗', ' ', ' ', ' ', ' '],
    3: [' ', ' ', '👟', ' ', '👟', ' ', ' ', ' '],
    2: [' ', '👟', ' ', ' ', ' ', '👟', ' ', ' '],
    1: ['👟', ' ', ' ', ' ', ' ', ' ', '👟', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).asTest("should be available to move on all diagonals")
})
