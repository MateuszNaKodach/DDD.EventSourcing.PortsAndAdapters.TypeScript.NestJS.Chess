import {ChessBoardGenerator} from "../../main/board";
import {EmojiConfiguration, EMOJIS_START_CONFIG, isPieceEmoji} from "@ddd-es-ts-chess/chess-piece-emoji";
import {ChessBoard} from "../../main/board";
import {Column, ColumnCharacter, Row, Square} from "../../main/board";
import {Pieces} from "../../main/pieces";
import {PieceEmojis} from "@ddd-es-ts-chess/chess-piece-emoji";
import {Side} from "../../main/pieces";
import {Piece} from "../../main/pieces";

export class TestChessBoardGenerator implements ChessBoardGenerator {

  constructor(private readonly piecesConfiguration: EmojiConfiguration = EMOJIS_START_CONFIG) {
  }

  generate(): ChessBoard {
    const pieces: { [square: string]: Piece } = {}
    Object.keys(this.piecesConfiguration)
        .map(row => row as unknown as EmojiConfiguration.RowNumber | 0)
        .filter(row => row !== 0)
        .map(row => row as unknown as EmojiConfiguration.RowNumber)
        .forEach(rowNumber => {
          const rowSquares = this.piecesConfiguration[rowNumber]
          rowSquares.forEach((squareValue: any, index: string | number) => {
            const columnCharacter = Square.uppercaseAvailableColumns[index as number] as ColumnCharacter
            if (isPieceEmoji(squareValue)) {
              const emojiPiece = PieceEmojis.toPiece(squareValue)
              const square = Square.at(Column.fromCharacter(columnCharacter), Row.fromNumber(rowNumber as Square.Number));
              pieces[square.algebraicNotation] = Pieces.getBy(emojiPiece.name, Side.byName(emojiPiece.side));
            }
          })
        })
    return ChessBoard.withPieces(pieces);
  }


}
