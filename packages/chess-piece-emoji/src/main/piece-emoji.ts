/**
 * ♙♟ - Pawn
 * ♖♜ - Rook
 * ♘♞ - Knight
 * ♗♝ - Bishop
 * ♕♛ - Queen
 * ♔♚ - King
 */

export const blackPieceEmojis = ["♟", "♜", "♞", "♝", "♛", "♚"] as const;
export const whitePieceEmojis = ["♙", "♖", "♘", "♗", "♕", "♔"] as const;
export type WhitePieceEmoji = typeof whitePieceEmojis[number]
export type BlackPieceEmoji = typeof blackPieceEmojis[number]
export type PieceEmoji = WhitePieceEmoji | BlackPieceEmoji

export function isWhitePieceEmoji(input: any): input is WhitePieceEmoji {
  return input !== undefined && whitePieceEmojis.includes(input);
}

export function isBlackPieceEmoji(input: any): input is BlackPieceEmoji {
  return input !== undefined && blackPieceEmojis.includes(input);
}

export function isPieceEmoji(input: any): input is PieceEmoji {
  return isWhitePieceEmoji(input) || isBlackPieceEmoji(input);
}
