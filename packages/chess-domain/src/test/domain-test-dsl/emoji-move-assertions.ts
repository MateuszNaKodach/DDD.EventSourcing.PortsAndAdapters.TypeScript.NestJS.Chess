import {ColumnCharacter} from "../../main/board";
import {isDefined, isNotDefined} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import {EmojiConfiguration, PieceEmoji} from "@ddd-es-ts-chess/chess-piece-emoji"

export namespace EmojiAssertions {
  import RowNumber = EmojiConfiguration.RowNumber;
  export type NormalMoveEmoji = "👟" | "🟩" | "⬇️" | "↘️" | "↙️" | "⬆️" | "↗️" | "↖️"
  export type AttackMoveEmoji = "⚔️" | "🗡️"
  export type MoveSquareValue = NormalMoveEmoji | AttackMoveEmoji | ColumnCharacter | " " | "_" | PieceEmoji

  export type EmojiMoveAssertion = { [key in RowNumber | 0]: MoveSquareValue[] }

  export function isAttackMoveEmoji(input: unknown): input is AttackMoveEmoji {
    return isDefined(input) && (input == "⚔️" || input == "🗡️");
  }

  export function isNormalMoveEmoji(input: unknown): input is NormalMoveEmoji {
    return isDefined(input) && (input == "👟" || input == "🟩");
  }
}
