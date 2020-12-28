import {ChessGameId} from "../../main/game";

describe("Chess Game Id", () => {

  const rawChessGameId = "rawChessGameId";

  it("of", () => {
    const chessGameId = ChessGameId.of(rawChessGameId)
    expect(chessGameId.raw).toBe(rawChessGameId);
  })

  it("toString should return raw value", () => {
    const chessGameId = ChessGameId.of(rawChessGameId)
    expect(chessGameId.toString()).toBe(rawChessGameId);
  })

})
