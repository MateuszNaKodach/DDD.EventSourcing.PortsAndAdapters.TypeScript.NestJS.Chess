import {ColumnCharacter, numberToColumn, Square} from "./square";

export function columnNumberToCharacter(columnNumber: Square.Number): ColumnCharacter {
  return numberToColumn[columnNumber] as ColumnCharacter;
}
