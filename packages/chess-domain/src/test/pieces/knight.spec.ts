import {Side} from "../../main/pieces/side";
import { EmojiChessBoardTestCase } from "../domain-test-dsl/board-spec.dsl";
import {Knight} from "../../main/pieces/knight";

describe("Knight", () => {

  const knightName = "Knight";
  const whiteKnight = new Knight(Side.WHITE);
  const blackKnight = new Knight(Side.BLACK);

  it(`should be named ${knightName}`, () => {
    expect(whiteKnight.name).toBe(knightName);
    expect(blackKnight.name).toBe(knightName);
  });

  EmojiChessBoardTestCase.givenChessBoard({
    8: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    7: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
    .whenPick({ piece: "♘", on: "B1" })
    .thenNormalMoves(["A3", "C3"])
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: "♘", on: "G1" })
    .thenNormalMoves(["F3", "H3"])
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: "♞", on: "B8" })
    .thenNormalMoves(["A6", "C6"])
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: "♞", on: "G8" })
    .thenNormalMoves(["F6", "H6"])
    .thenAttackMoveIsNotAvailable()
    .asTest("should be available to move on start");


  EmojiChessBoardTestCase.givenChessBoard({
    8: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    7: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
    .whenPick({ piece: "♘", on: "B1" })
    .thenNormalMoves(["A3", "C3"])
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: "♘", on: "G1" })
    .thenNormalMoves(["F3", "H3"])
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: "♞", on: "B8" })
    .thenNormalMoves(["A6", "C6"])
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: "♞", on: "G8" })
    .thenNormalMoves(["F6", "H6"])
    .thenAttackMoveIsNotAvailable()
    .asTest("should be available to move on start");

  EmojiChessBoardTestCase.givenChessBoard({
    8: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    7: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).thenExpectMoves({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: ["👟", " ", "👟", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", "♘", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).asTest("should be able to jump at start");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).thenExpectMoves({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "👟", " ", "👟", " ", " ", " "],
    5: [" ", "👟", " ", " ", " ", "👟", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "👟", " ", " ", " ", "👟", " ", " "],
    2: [" ", " ", "👟", " ", "👟", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).asTest("should be able to jump all directions");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "♟", " ", "♟", " ", " ", " "],
    5: [" ", "♟", " ", " ", " ", "♟", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "♟", " ", " ", " ", "♟", " ", " "],
    2: [" ", " ", "♟", " ", "♟", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).thenExpectMoves({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "🗡️", " ", "🗡️", " ", " ", " "],
    5: [" ", "🗡️", " ", " ", " ", "🗡️", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "🗡️", " ", " ", " ", "🗡️", " ", " "],
    2: [" ", " ", "🗡️", " ", "🗡️", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).asTest("should be able to attack in all directions");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "♟", " ", " ", " ", " ", " "],
    5: [" ", "♟", " ", " ", " ", "♟", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "♟", " ", " ", " ", "♟", " ", " "],
    2: [" ", " ", " ", " ", "♟", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).thenExpectMoves({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "🗡️", " ", "👟", " ", " ", " "],
    5: [" ", "🗡️", " ", " ", " ", "🗡️", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "🗡️", " ", " ", " ", "🗡️", " ", " "],
    2: [" ", " ", "👟", " ", "🗡️", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).asTest("should be able to attack in all directions and move on free squares within knight pattern");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "♙", " ", "♙", " ", " ", " "],
    5: [" ", "♙", " ", " ", " ", "♙", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "♙", " ", " ", " ", "♙", " ", " "],
    2: [" ", " ", "♙", " ", "♙", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).whenPick({ piece: "♘", on: "D4" })
    .thenNormalMoveIsNotAvailable()
    .thenAttackMoveIsNotAvailable()
    .asTest("should not be able to attack allies");


  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", "♟", " ", "♟", " ", " ", " "],
    5: [" ", "♟", " ", " ", " ", "♟", " ", " "],
    4: [" ", " ", " ", "♘", " ", " ", " ", " "],
    3: [" ", "♟", " ", " ", " ", "♟", " ", " "],
    2: [" ", " ", "♟", " ", "♟", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).whenPick({ piece: "♘", on: "D4" })
    .thenNormalMoveIsNotAvailable()
    .thenAttackMoves(["B3", "B5", "C2", "C6", "E2", "E6", "F3", "F5"])
    .asTest("should be able to attack in all directions");

});
