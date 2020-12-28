import { PieceEmoji } from "./piece-emoji";

const uppercaseAvailableColumns = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

type PieceColumnCharacter = typeof uppercaseAvailableColumns[number];

export namespace EmojiConfiguration {
  export type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  export type SquareVale = PieceEmoji | PieceColumnCharacter | ' ' | '_'
}

export type EmojiConfiguration = { [key in EmojiConfiguration.RowNumber | 0]: EmojiConfiguration.SquareVale[] }

export const EMOJIS_START_CONFIG: EmojiConfiguration = {
  8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
}
