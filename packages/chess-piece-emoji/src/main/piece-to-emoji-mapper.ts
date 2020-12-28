import { isBlackPieceEmoji, PieceEmoji } from "./piece-emoji";

const pieces = ["King", "Queen", "Bishop", "Knight", "Rook", "Pawn"] as const;
export type EmojiPieceName = typeof pieces[number];
export type EmojiPieceSide = "black" | "white";

function sideOf(pieceEmoji: PieceEmoji): EmojiPieceSide {
  return isBlackPieceEmoji(pieceEmoji) ? "black" : "white";
}

type EmojiPieceMapping = { [key in EmojiPieceName]: { [key in EmojiPieceSide]: PieceEmoji } };

const mappingOfPieces: EmojiPieceMapping = {
  Bishop: { black: "♝", white: "♗" },
  Knight: { black: "♞", white: "♘" },
  Pawn: { black: "♟", white: "♙" },
  Queen: { black: "♛", white: "♕" },
  Rook: { black: "♜", white: "♖" },
  King: { white: "♔", black: "♚" }
};

export class PieceEmojis {

  static toIcon(name: EmojiPieceName, side: EmojiPieceSide): string {
    return mappingOfPieces[name][side];
  }

  static toPiece(emoji: PieceEmoji): { name: EmojiPieceName, side: EmojiPieceSide } {
    const pieceName = Object.keys(mappingOfPieces)
      .map(pieceName => pieceName as EmojiPieceName)
      .find(pieceName => {
        const pieceMapping = mappingOfPieces[pieceName];
        return pieceMapping.black === emoji || pieceMapping.white === emoji;
      });
    if (!pieceName) {
      throw new Error(`Lack of mapping for emoji ${emoji}`);
    }
    return { name: pieceName, side: sideOf(emoji) };
  }

  toIcon(name: EmojiPieceName, side: EmojiPieceSide): string {
    return PieceEmojis.toIcon(name, side);
  }

  toPiece(emoji: PieceEmoji): { name: EmojiPieceName, side: EmojiPieceSide } {
    return PieceEmojis.toPiece(emoji);
  }

}
