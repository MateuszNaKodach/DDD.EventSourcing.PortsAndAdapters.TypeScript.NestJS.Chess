import {givenEvents} from "./chess-game.event-assertions";
import {Side} from "../../main/pieces";
import {ChessGameStarted} from "../../main/event";
import {ChessGameId, PlayerId} from "../../main/game";
import {CausationId, CorrelationId, TimeProvider} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {TestTimeProvider} from "../time/test-time-provider";
import {board} from "../domain-test-dsl/fixtures";

describe("Chess Game | Replaying - ChessGameStarted", () => {

  [
    board({
      8: ["♜", "♞", "♝", "♛", " ", "♝", "♞", "♜"],
      7: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
      6: [" ", " ", " ", " ", " ", " ", " ", " "],
      5: [" ", " ", " ", " ", " ", " ", " ", " "],
      4: [" ", " ", " ", " ", " ", " ", " ", " "],
      3: [" ", " ", " ", " ", " ", " ", " ", " "],
      2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
      1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
      0: ["A", "B", "C", "D", "E", "F", "G", "H"]
    }),
    board({
      8: ["♜", "♞", "♝", "♛", " ", "♝", "♞", "♜"],
      7: ["♟", "♟", " ", "♟", "♟", "♟", "♟", "♟"],
      6: [" ", " ", " ", " ", " ", " ", " ", " "],
      5: [" ", " ", " ", " ", " ", " ", " ", " "],
      4: [" ", " ", " ", "♚", " ", " ", " ", " "],
      3: [" ", " ", "♟", " ", " ", " ", " ", " "],
      2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
      1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
      0: ["A", "B", "C", "D", "E", "F", "G", "H"]
    })
  ].map(givenBoard => {
    it("when replay event with chess board config", () => {
      const chessGameId = ChessGameId.generate();
      const timeProvider: TimeProvider = new TestTimeProvider()
      givenEvents({
        events: [
          ChessGameStarted.event(
              chessGameId,
              timeProvider.currentDate(),
              {
                chessGameId: chessGameId,
                startSide: Side.WHITE,
                chessBoard: givenBoard,
                players: {
                  white: PlayerId.of("white"),
                  black: PlayerId.of("black")
                }
              },
              {causationId: CausationId.generate(), correlationId: CorrelationId.generate()}
          )
        ]
      }).thenBoard(givenBoard);
    });
  });


});
