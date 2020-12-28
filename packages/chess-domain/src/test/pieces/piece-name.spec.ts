import {isPieceName, isPromotionPieceName} from "../../main/pieces";

describe("Promotion Piece Name", () => {

  describe("Pieces to which a pawn can be promoted are", () => {

    ["Rook", "Knight", "Bishop", "Queen"].map(pieceName => it(pieceName, () => {
      expect(isPromotionPieceName(pieceName)).toBeTruthy();
    }))

  })

  describe("Pieces to which a pawn cannot be promoted are", () => {

    ["Pawn", "King"].map(pieceName => it(pieceName, () => {
      expect(isPromotionPieceName(pieceName)).toBeFalsy();
    }))

  })

})

describe("Piece Name", () => {

  describe("correct English piece names are ", () => {

    ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"].map(pieceName => it(pieceName, () => {
      expect(isPieceName(pieceName)).toBeTruthy();
    }))

  })

  describe("incorrect English piece names are ", () => {

    ["Hetman", "Szakalaka", "Cos innego"].map(pieceName => it(pieceName, () => {
      expect(isPieceName(pieceName)).toBeFalsy();
    }))

  })

})
