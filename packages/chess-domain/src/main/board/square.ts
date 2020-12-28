import {columnNumberToCharacter} from "./helper";

export const SQUARE_ID_SEPARATOR = "-";

export type TransformParams = { row?: number | undefined, col?: number | undefined };

export class Square {
  readonly column: Column;
  readonly row: Row;

  private constructor(column: Column, row: Row) {
    this.column = column;
    this.row = row;
  }

  static at(column: ColumnCharacter | Square.Number | Column, row: Square.Number | Row): Square {
    let newColumn: Column;
    let newRow: Row;

    if (Column.isValidColumnCharacter(column)) {
      newColumn = Column.fromCharacter(column);
    } else if (Column.isValidColumnNumber(column)) {
      newColumn = Column.fromCharacter(columnNumberToCharacter(column));
    } else {
      newColumn = column;
    }

    if (row instanceof Row) {
      newRow = row;
    } else {
      newRow = Row.fromNumber(row);
    }
    return new Square(newColumn, newRow);
  }

  static fromAlgebraicNotation(notation: string): Square {
    if(notation.length !== 2){
      throw new Error(`${notation} is not valid chess algebraic notation square!`)
    }
    const columnNumber = notation.charAt(0) as ColumnCharacter;
    const rowNumber = notation.charAt(1);
    return new Square(Column.fromCharacter(columnNumber), Row.fromNumber(parseInt(rowNumber) as Square.Number));
  }

  static withId(squareId: Square["id"]): Square {
    const [column, row] = squareId.split(SQUARE_ID_SEPARATOR);
    return Square.at(column as ColumnCharacter, Number.parseInt(row) as Square.Number);
  }

  get col(): Column {
    return this.column;
  }

  atColumn(column: Column): Square {
    return new Square(column, this.row);
  }

  atRow(row: Row): Square {
    return new Square(this.column, row);
  }

  atX(x: Square.Number): Square {
    return this.atColumn(Column.fromCharacter(columnNumberToCharacter(x)));
  }

  atY(y: Square.Number): Square {
    return this.atRow(Row.fromNumber(y));
  }

  transform(props: TransformParams): Square | undefined {
    let result: Square | undefined = this;
    if (props.row) {
      const rowNumber = this.row.number + props.row;
      if (Row.isValidRowNumber(rowNumber)) {
        result = result.atY(rowNumber);
      } else {
        return undefined;
      }
    }
    if (props.col) {
      const columnNumber = this.column.number + props.col;
      if (Column.isValidColumnNumber(columnNumber)) {
        result = result.atX(columnNumber);
      } else {
        return undefined;
      }
    }
    return result;
  }

  difference(anotherSquare: Square): TransformParams {
    return {col: anotherSquare.column.number - this.column.number, row: anotherSquare.row.number - this.row.number};
  }

  get id(): string {
    return `${this.column.character}${SQUARE_ID_SEPARATOR}${this.row.number}`;
  }

  get algebraicNotation(): string {
    return `${this.column.character}${this.row.number}`;
  }

  equals(square: Square | undefined): boolean {
    if (!square) {
      return false;
    }
    return this.algebraicNotation === square.algebraicNotation;
  }


}

/*
More about this:
https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values
 */
export namespace Square {
  export type Number = typeof availableNumber[number]
  export const availableNumber = [1, 2, 3, 4, 5, 6, 7, 8] as const;
  export const lowercaseAvailableColumns = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
  export const uppercaseAvailableColumns = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
}

export class Row {

  readonly number: Square.Number;

  static fromNumber(rowNumber: Square.Number): Row {
    return new Row(rowNumber);
  }

  private constructor(rowNumber: Square.Number) {
    this.number = rowNumber;
  }

  static isValidRowNumber(rowNumber: any): rowNumber is Square.Number {
    return Square.availableNumber.includes(Number.parseInt(rowNumber) as Square.Number);
  }

}


export type ColumnCharacter = typeof Square.uppercaseAvailableColumns[number];

export const columnToNumber = {
  "A": 1,
  "B": 2,
  "C": 3,
  "D": 4,
  "E": 5,
  "F": 6,
  "G": 7,
  "H": 8
}

export const numberToColumn = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H"
}

export class Column {

  readonly character: ColumnCharacter;

  private constructor(columnCharacter: ColumnCharacter) {
    this.character = columnCharacter;
  }

  static fromCharacter(columnCharacter: ColumnCharacter): Column {
    return new Column(columnCharacter.toUpperCase() as ColumnCharacter);
  }

  static isValidColumnCharacter(columnCharacter: any): columnCharacter is ColumnCharacter {
    return typeof columnCharacter === "string" && Square.uppercaseAvailableColumns.includes(columnCharacter.toUpperCase() as ColumnCharacter);
  }

  static isValidColumnNumber(columnNumber: any): columnNumber is Square.Number {
    return Square.availableNumber.includes(columnNumber);
  }

  get number(): number {
    return columnToNumber[this.character]
  }

}
