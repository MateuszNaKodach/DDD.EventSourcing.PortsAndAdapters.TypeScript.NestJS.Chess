import {Column, numberToColumn, Row, Square} from '../../main/board/square';
import {columnNumberToCharacter} from "../../main/board/helper";

describe('Square on board', () => {

  describe("Row", () => {

    Square.availableNumber.map(number => {
      it(`can be a number ${number}`, () => {
        const row = Row.fromNumber(number);
        expect(row.number).toBe(number);
      })
    });

  });

  describe("Column", () => {

    Square.uppercaseAvailableColumns.map(columnCharacter => {
      it(`can be a "${columnCharacter}" letter`, () => {
        const column = Column.fromCharacter(columnCharacter);
        expect(column.character).toBe(columnCharacter);
        expect(column.number).toBe(Square.uppercaseAvailableColumns.indexOf(columnCharacter) +1);
      })
    });

    Square.availableNumber.map(number => {
      const columnCharacter = numberToColumn[number];
      it(`can be a number ${number}, which is column ${columnCharacter}`, () => {
        const column = Column.fromCharacter(columnNumberToCharacter(number));
        expect(column.character).toBe(columnCharacter);
        expect(column.number).toBe(number);
      })
    });

  })

  describe("Algebraic notation", () => {
    [
      {algebraic: "A1", square: {column: "A", row: 1}},
      {algebraic: "A8", square: {column: "A", row: 8}},
      {algebraic: "D5", square: {column: "D", row: 5}},
      {algebraic: "H1", square: {column: "H", row: 1}},
      {algebraic: "H8", square: {column: "H", row: 8}},
    ].map(testCase => {
      it(`square in algebraic notation ${testCase.algebraic} should have row: ${testCase.square.row} and column ${testCase.square.column}`, () => {
        const square = Square.fromAlgebraicNotation(testCase.algebraic)
        expect(square.column.character).toBe(testCase.square.column)
        expect(square.row.number).toBe(testCase.square.row)
      })
    })
  })

});
