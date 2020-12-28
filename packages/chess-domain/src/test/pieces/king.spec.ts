import {King} from "../../main/pieces/king";
import {Side} from "../../main/pieces/side";
import {EmojiChessBoardTestCase} from "../domain-test-dsl/board-spec.dsl";

describe("King", () => {

  const kingName = "King";
  const whiteKing = new King(Side.WHITE);
  const blackKing = new King(Side.BLACK);

  describe("white king", () => {

    it(`should be named ${kingName}`, () => {
      expect(whiteKing.name).toBe(kingName);
    });

    it(`should be on ${Side.WHITE} side`, () => {
      expect(whiteKing.side).toBe(Side.WHITE);
    });


  });

  describe("black king", () => {

    it(`should be named ${kingName}`, () => {
      expect(blackKing.name).toBe(kingName);
    });

    it(`should be on ${Side.BLACK} side`, () => {
      expect(blackKing.side).toBe(Side.BLACK);
    });

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
      .whenPick({piece: "♔", on: "E1"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .and()
      .whenPick({piece: "♚", on: "E8"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .asTest("should not be avaiable to move at game start");

  it("can move in eight directions", () => {
    EmojiChessBoardTestCase.givenChessBoard({
      8: [" ", " ", " ", " ", " ", " ", " ", " "],
      7: [" ", " ", " ", " ", " ", " ", " ", " "],
      6: [" ", " ", " ", " ", " ", " ", " ", " "],
      5: [" ", " ", " ", " ", " ", " ", " ", " "],
      4: [" ", " ", " ", " ", "♔", " ", " ", " "],
      3: [" ", " ", " ", " ", " ", " ", " ", " "],
      2: [" ", " ", " ", " ", " ", " ", " ", " "],
      1: [" ", " ", " ", " ", " ", " ", " ", " "],
      0: ["A", "B", "C", "D", "E", "F", "G", "H"]
    })
        .whenPick({piece: "♔", on: "E4"})
        .thenNormalMoves(["D3", "D4", "D5", "E3", "E5", "F3", "F4", "F5"])
        .thenAttackMoveIsNotAvailable()
        .assert();
  })

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", "♜", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .whenPick({piece: "♔", on: "E4"})
      .thenNormalMoves(["E3", "E5", "F3", "F4", "F5"])
      .thenAttackMoveIsNotAvailable()
      .asTest("cannot move on field attacked by opponent");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", "♜", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", "♜", " ", "♟", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", "♟", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .whenPick({piece: "♔", on: "E4"})
      .thenNormalMoves(["E3", "F4"])
      .thenAttackMoves(["F3"])
      .asTest("cannot attack on field attacked by opponent");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", "♟", "♟", "♟", " ", " ", " "],
    4: [" ", " ", "♟", "♔", "♟", " ", " ", " "],
    3: [" ", " ", "♟", "♟", "♟", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).thenExpectMoves({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", "🗡️", "🗡️", "🗡️", " ", " ", " "],
    4: [" ", " ", " ", "♔", " ", " ", " ", " "],
    3: [" ", " ", "🗡️", " ", "🗡️", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  }).asTest("should be available to attack in all directions, but cannot move on square which can be attacked");


  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", "♜", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", "♜", " ", "♟", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", "♟", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♔", on: "E4"})
      .isCheck()
      .asTest("when opponent can attack then king is check");


  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", "♝", "♛", " ", "♝", " ", " "],
    7: [" ", " ", "♕", "♚", "♟", " ", " ", " "],
    6: [" ", " ", " ", "♜", " ", " ", " ", " "],
    5: [" ", " ", " ", "♙", "♙", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", "♔", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♚", on: "D7"})
      .isCheck()
      .asTest("when king is in check then only available moves which will not keep king in check");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", "♝", "♛", " ", "♝", " ", " "],
    7: [" ", " ", "♕", "♚", "♟", " ", " ", " "],
    6: [" ", " ", " ", "♜", " ", " ", " ", " "],
    5: [" ", " ", " ", "♙", "♙", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", "♔", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .whenPick({piece: "♕", on: "C7"})
      .thenAttackMoves(["C8", "D8", "D7", "D6"])
      .and()
      .whenPick({piece: "♚", on: "D7"})
      .thenAttackMoves(["C7"])
      .thenNormalMoves(["E8"])
      .and()
      .whenPick({piece: "♛", on: "D8"})
      .thenNormalMoves([])
      .thenAttackMoves(["C7"])
      .asTest("when king is in check then only available moves which will not keep king in check");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", "♜", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", "♜", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", "♔", "♟", " ", " "],
    3: [" ", " ", " ", " ", " ", "♟", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♔", on: "E4"})
      .isNotCheck()
      .asTest("when opponent cannot attack then king is not check");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", "♜", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", "♜", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♔", on: "E4"})
      .isNotCheckmate()
      .asTest("when king can save himself is not checkmate");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", "♜", "♜", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", "♜", "♜", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♔", on: "E4"})
      .isCheckmate()
      .asTest("when king is checked and cannot move is checkmate");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", "♜", "♜", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", "♜", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", "♜", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♔", on: "E4"})
      .isNotCheckmate()
      .asTest("when king is checked and can himself by attack is not checkmate");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", " ", " ", " ", " ", " "],
    7: [" ", " ", " ", " ", " ", " ", " ", " "],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", "♜", "♜", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", "♔", " ", " ", " "],
    3: [" ", " ", " ", " ", "♜", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .kingOn({king: "♔", on: "E4"})
      .isNotCheckmate()
      .asTest("when king is checked and can move is not checkmate");

  EmojiChessBoardTestCase.givenChessBoard({
    8: [" ", " ", " ", "♚", " ", " ", " ", " "],
    7: [" ", " ", " ", "♙", " ", " ", " ", " "],
    6: [" ", " ", " ", "♔", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: [" ", " ", " ", " ", " ", " ", " ", " "],
    1: [" ", " ", " ", " ", " ", " ", " ", " "],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
      .whenPick({piece: "♚", on: "D8"})
      .thenNormalMoveIsNotAvailable()
      .thenAttackMoveIsNotAvailable()
      .asTest("when king is not check and cannot move then stalemate");

});
