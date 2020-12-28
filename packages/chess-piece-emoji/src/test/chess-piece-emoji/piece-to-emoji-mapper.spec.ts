import {PieceEmojis, EmojiPieceName} from "../../main";
import { PieceEmoji } from "../../main";

type PieceMapperTestCase = { piece: { name: EmojiPieceName, side: "white" | "black" }, emoji: PieceEmoji }

describe("PieceMapper | Name and side to emoji", () => {

  const testCases: PieceMapperTestCase[] = [
    { piece: { name: "King", side: "black" }, emoji: `♚` },
    { piece: { name: "Queen", side: "black" }, emoji: `♛` },
    { piece: { name: "Bishop", side: "black" }, emoji: `♝` },
    { piece: { name: "Knight", side: "black" }, emoji: `♞` },
    { piece: { name: "Rook", side: "black" }, emoji: `♜` },
    { piece: { name: "Pawn", side: "black" }, emoji: `♟` },
    { piece: { name: "King", side: "white" }, emoji: `♔` },
    { piece: { name: "Queen", side: "white" }, emoji: `♕` },
    { piece: { name: "Bishop", side: "white" }, emoji: `♗` },
    { piece: { name: "Knight", side: "white" }, emoji: `♘` },
    { piece: { name: "Rook", side: "white" }, emoji: `♖` },
    { piece: { name: "Pawn", side: "white" }, emoji: `♙` }
  ];

  testCases.map(testCase => {
    it(`${testCase.piece.side} ${testCase.piece.name} as emoji should be ${testCase.emoji}`, () => {
      expect(PieceEmojis.toIcon(testCase.piece.name, testCase.piece.side)).toEqual(testCase.emoji);
    });

    it(`emoji ${testCase.emoji} as piece should be ${testCase.piece.side} ${testCase.piece.name}`, () => {
      const piece = PieceEmojis.toPiece(testCase.emoji);
      expect(piece.name).toEqual(testCase.piece.name);
      expect(piece.side).toEqual(testCase.piece.side);
    });
  });

});
