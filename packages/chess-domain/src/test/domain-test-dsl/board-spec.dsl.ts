import {Piece} from "../../main/pieces";
import {Column, ColumnCharacter, Row, Square} from "../../main/board";
import {ChessBoard} from "../../main/board";
import {EmojiConfiguration} from "@ddd-es-ts-chess/chess-piece-emoji";
import {King} from "../../main/pieces";
import {Side} from "../../main/pieces";
import {EmojiAssertions} from "./emoji-move-assertions";
import {isPieceEmoji, PieceEmoji} from "@ddd-es-ts-chess/chess-piece-emoji";
import {Pieces} from "../../main/pieces";
import {TestChessBoardGenerator} from "./test-chess-board-generator";
import RowNumber = EmojiConfiguration.RowNumber;
import EmojiMoveAssertion = EmojiAssertions.EmojiMoveAssertion;
import isAttackMoveEmoji = EmojiAssertions.isAttackMoveEmoji;
import isNormalMoveEmoji = EmojiAssertions.isNormalMoveEmoji;
import {PieceEmojis} from "@ddd-es-ts-chess/chess-piece-emoji";
import {isDefined} from "@ddd-es-ts-chess/ddd-building-blocks-domain";
import 'jest-extended';

export type Picked = { piece: PieceEmoji | Piece, on: string }

export class EmojiChessBoardTestCase {

  constructor(
      private readonly chessBoard: ChessBoard,
      private readonly emojiConfiguration: EmojiConfiguration,
      private readonly previous: PickedChessAssertion | undefined = undefined
  ) {
  }

  static givenChessBoard(emojiConfiguration: EmojiConfiguration): EmojiChessBoardTestCase {
    const chessBoard = new TestChessBoardGenerator(emojiConfiguration).generate();
    return new EmojiChessBoardTestCase(chessBoard, emojiConfiguration);
  }

  testStalemate(side: Side, message = "then is stalemate"): void {
    return it(message, () => expect(this.chessBoard.isStalemateFor(side)).toBeTruthy());
  }

  whenPick(props: Picked): PickedChessAssertion {
    const square = Square.fromAlgebraicNotation(props.on);
    const pickedPiece = this.tryToGet({piece: props.piece, square});
    return new PickedChessAssertion(this.chessBoard, {
      piece: pickedPiece,
      on: square
    }, this.emojiConfiguration, pickedPiece, this.previous);
  }

  kingOn(props: { king: "♚" | "♔", on: string }): KingAssertion {
    const square = Square.fromAlgebraicNotation(props.on);
    const pickedPiece = this.tryToGet({piece: props.king, square});
    if (!(pickedPiece instanceof King)) {
      throw new Error("Selected piece is not a king!");
    }
    return new KingAssertion(pickedPiece, square, this.chessBoard);
  }

  tryToGet(props: { piece: Piece | PieceEmoji, square: Square }): Piece {
    const {piece, square} = props;
    const pieceOnSquare = this.chessBoard.pieceOn(square);
    const pickedPiece: Piece = isPieceEmoji(piece) ? Pieces.getBy(PieceEmojis.toPiece(piece).name, Side.byName(PieceEmojis.toPiece(piece).side)) : piece as Piece;
    if (!isDefined(pieceOnSquare) || pickedPiece.name !== pieceOnSquare.name || pickedPiece.side !== pieceOnSquare.side) {
      throw new Error("Selected piece is not on the square!");
    }
    return pickedPiece;
  }

  thenExpectMoves(expectedMoves: EmojiMoveAssertion, assert = false): ChessBoardEmojiAssertion {
    let piece: Piece;
    let pieceSquare: Square;
    let attackPieceMoves: Square[] = [];
    let normalPieceMoves: Square[] = [];
    const expectedAttackMoves: Square[] = [];
    const expectedNormalMoves: Square[] = [];
    Object.keys(expectedMoves)
        .map(row => row as unknown as RowNumber | 0)
        .filter(row => row !== 0)
        .map(row => row as unknown)
        .map(row => parseInt(row as string))
        .map(row => row as RowNumber)
        .forEach(rowNumber => {
          const rowSquares = expectedMoves[rowNumber];
          rowSquares.forEach((squareValue: any, index: string | number) => {
            const columnCharacter = Square.uppercaseAvailableColumns[index as number] as ColumnCharacter;
            if (isAttackMoveEmoji(squareValue)) {
              const pieceRow = rowNumber;
              if (Row.isValidRowNumber(pieceRow)) {
                expectedAttackMoves.push(Square.at(Column.fromCharacter(columnCharacter), Row.fromNumber(pieceRow)));
              }
            }
            if (isNormalMoveEmoji(squareValue)) {
              const pieceRow = rowNumber;
              if (Row.isValidRowNumber(pieceRow)) {
                expectedNormalMoves.push(Square.at(Column.fromCharacter(columnCharacter), Row.fromNumber(pieceRow)));
              }
            }
            if (isPieceEmoji(squareValue)) {
              const emojiPiece = PieceEmojis.toPiece(squareValue);
              piece = Pieces.getBy(emojiPiece.name, Side.byName(emojiPiece.side));
              const pieceRow = rowNumber;
              if (Row.isValidRowNumber(pieceRow)) {
                const square = Square.at(Column.fromCharacter(columnCharacter), Row.fromNumber(pieceRow));
                pieceSquare = square;
                normalPieceMoves = piece.getNonAttackMoves(this.chessBoard, square).map(it => it.square);
                attackPieceMoves = piece.getAttackMoves(this.chessBoard, square).map(it => it.square);
              }
            }
          });
        });
    if (assert) {
      expect(expectedNormalMoves).toIncludeSameMembers(normalPieceMoves);
      expect(expectedAttackMoves).toIncludeSameMembers(attackPieceMoves);
    }
    return new ChessBoardEmojiAssertion(this.emojiConfiguration, expectedNormalMoves, expectedAttackMoves, normalPieceMoves, attackPieceMoves, piece!, pieceSquare!, expectedMoves);
  }

}

class ChessBoardEmojiAssertion {

  constructor(
      private emojiConfiguration: EmojiConfiguration,
      private expectedNormalMoves: Square[],
      private expectedAttackMoves: Square[],
      private normalPieceMoves: Square[],
      private attackPieceMoves: Square[],
      private picked: Piece,
      private square: Square,
      private expectedMoves: EmojiMoveAssertion) {
  }

  assert() {
    expect(this.expectedNormalMoves).toIncludeSameMembers(this.normalPieceMoves);
    expect(this.expectedAttackMoves).toIncludeSameMembers(this.attackPieceMoves);
  }

  toString() {
    return `Given:
        ${toEmojiConfigStringForMoveAssertion(this.emojiConfiguration, "\t")}
        Then moves:
        ${toMoveAssertionString(this.expectedMoves)}
    `;
  }

  asTest(scenario: string) {
    const testName = scenario ? `Scenario: ${scenario}
        ${this.toString()}` : this.toString();
    return it(testName, () => this.assert());
  }
}

class PickedChessAssertion {

  private expectedNormalMoves: Square[] | undefined = undefined;
  private expectedAttackMoves: Square[] | undefined = undefined;
  private normalMoves: Square[] | undefined = undefined;
  private attackMoves: Square[] | undefined = undefined;
  private movesByFn: Square[] = [];

  constructor(
      private readonly chessBoard: ChessBoard,
      private readonly picked: { piece: PieceEmoji | Piece, on: Square },
      private readonly emojiConfiguration: EmojiConfiguration,
      private readonly pieceOnSquare: Piece,
      private readonly previous: PickedChessAssertion | undefined = undefined) {
  }

  whenGetMovesBy(movesFn: (chessBoard: ChessBoard, piece: Piece, square: Square) => Square[]) {
    this.movesByFn = movesFn(this.chessBoard, this.pieceOnSquare, this.picked.on);
    return this;
  }

  assertGetMoves(squares: string[]) {
    const sq = squares.map(it => Square.fromAlgebraicNotation(it));
    const movesSquares = this.movesByFn;
    expect(sq).toIncludeSameMembers(movesSquares);
  }

  thenNormalMoves(squares: string[], assert = false) {
    if (squares.length === 0) {
      return this.thenNormalMoveIsNotAvailable(assert);
    }
    const normalMoves = this.pieceOnSquare.getNonAttackMoves(this.chessBoard, this.picked.on)
        .map(it => it.square);
    if (assert) {
      expect(normalMoves).toIncludeSameMembers(squares.map(it => Square.fromAlgebraicNotation(it)));
    } else {
      this.normalMoves = normalMoves;
      this.expectedNormalMoves = squares.map(it => Square.fromAlgebraicNotation(it));
    }
    return this;
  }

  thenNormalMoveIsNotAvailable(assert = false) {
    const normalMoves = this.pieceOnSquare.getNonAttackMoves(this.chessBoard, this.picked.on)
        .map(it => it.square);
    if (assert) {
      expect(Object.keys(normalMoves)).toHaveLength(0);
    } else {
      this.normalMoves = normalMoves;
      this.expectedNormalMoves = [];
    }
    return this;
  }

  thenAttackMoves(squares: string[], assert = false) {
    if (squares.length === 0) {
      return this.thenAttackMoveIsNotAvailable(assert);
    }
    const attackMoves = this.pieceOnSquare.getAttackMoves(this.chessBoard, this.picked.on)
        .map(it => it.square);
    if (assert) {
      expect(attackMoves).toIncludeSameMembers(squares.map(it => Square.fromAlgebraicNotation(it)));
    } else {
      this.attackMoves = attackMoves;
      this.expectedAttackMoves = squares.map(it => Square.fromAlgebraicNotation(it));
    }
    return this;
  }

  thenAttackMoveIsNotAvailable(assert = false) {
    const attackMoves = this.pieceOnSquare.getAttackMoves(this.chessBoard, this.picked.on)
        .map(it => it.square);
    if (assert) {
      expect(Object.keys(attackMoves)).toHaveLength(0);
    } else {
      this.attackMoves = attackMoves;
      this.expectedAttackMoves = [];
    }
    return this;
  }

  assert() {
    this.assertThis(this);
  }

  assertThis(assertions: PickedChessAssertion | undefined = undefined) {
    if (assertions?.previous) {
      this.assertThis(assertions.previous);
    }
    if (assertions) {
      if (assertions.attackMoves && assertions.expectedAttackMoves) {
        expect(assertions.expectedAttackMoves).toIncludeSameMembers(assertions.attackMoves);
      }
      if (assertions.normalMoves && assertions.expectedNormalMoves) {
        expect(assertions.expectedNormalMoves).toIncludeSameMembers(assertions.normalMoves);
      }
    }
  }

  toString() {
    return `Given:
        ${toString(this.emojiConfiguration)}
        ${this.toStringWhenThen(this)}
    `;
  }

  toStringWhenThen(assertion: PickedChessAssertion): string {
    const thenNormalMoves = !assertion.expectedNormalMoves ? "" : `Then:
        normal moves should ${assertion.expectedNormalMoves.length === 0 ? "not be available" : "be " + squaresToString(assertion.expectedNormalMoves)}`;
    const thenAttackMoves = !assertion.expectedAttackMoves ? "" : `Then:
        attack moves should ${assertion.expectedAttackMoves.length === 0 ? "not be available" : "be " + squaresToString(assertion.expectedAttackMoves)}`;
    const thisString =
        `
        When:
        pick ${isPieceEmoji(assertion.picked.piece) ? this.picked.piece : PieceEmojis.toIcon(assertion.picked.piece.name, assertion.picked.piece.side)} on ${assertion.picked.on.algebraicNotation}
        ${thenNormalMoves}
        ${thenAttackMoves}
    `;
    return assertion.previous ? this.toStringWhenThen(assertion.previous) + thisString : thisString;
  }

  and() {
    return new EmojiChessBoardTestCase(this.chessBoard, this.emojiConfiguration, this);
  }

  andKing(props: { king: "♚" | "♔", on: string }) {
    const square = Square.fromAlgebraicNotation(props.on);
    const pieceOnSquare = this.chessBoard.pieceOn(square);
    const pickedPiece: King = isPieceEmoji(props.king) ? Pieces.getBy(PieceEmojis.toPiece(props.king).name, Side.byName(PieceEmojis.toPiece(props.king).side)) as King : props.king as King;
    if (!isDefined(pieceOnSquare) || pickedPiece.name !== pieceOnSquare.name || pickedPiece.side !== pieceOnSquare.side) {
      throw new Error("Selected piece is not on the square!");
    }
    return new KingAssertion(pickedPiece, square, this.chessBoard);
  }


  asTest(scenario: string) {
    return it(dslString({name: scenario, assertion: this}), () => this.assert());
  }

}

class KingAssertion {

  private assertion: any;

  constructor(private readonly king: King, private readonly onSquare: Square, private readonly chessBoard: ChessBoard) {
  }

  isCheck(assert = false) {
    const assertion = () => expect(this.king.isInCheck(this.chessBoard, this.onSquare)).toBeTruthy();
    if (assert) {
    } else {
      this.assertion = assertion;
    }
    return this;
  }

  isNotCheck(assert = false) {
    const assertion = () => expect(this.king.isInCheck(this.chessBoard, this.onSquare)).toBeFalsy();
    if (assert) {
    } else {
      this.assertion = assertion;
    }
    return this;
  }

  isCheckmate(assert = false) {
    const assertion = () => expect(this.king.isCheckmate(this.chessBoard, this.onSquare)).toBeTruthy();
    if (assert) {
      assertion();
    } else {
      this.assertion = assertion;
    }
    return this;
  }

  isNotCheckmate(assert = false) {
    const assertion = () => expect(this.king.isCheckmate(this.chessBoard, this.onSquare)).toBeFalsy();
    if (assert) {
      assertion();
    } else {
      this.assertion = assertion;
    }
    return this;
  }

  assert(): void {
    this.assertion();
  }


  asTest(scenario: string) {
    return it(scenario, () => this.assertion());
  }
}


export type ChessBoardDslTestCase = {
  name: string | undefined,
  assertion: PickedChessAssertion
}

export function dslString(dsl: ChessBoardDslTestCase): string {
  return dsl.name ? `Scenario: ${dsl.name}
        ${dsl.assertion.toString()}` : `${dsl.assertion.toString()}`;
}


function squaresToString(squares: Square[]) {
  if (squares.length === 0) {
    return "[]";
  }
  return `[${squares.map(it => it.algebraicNotation).reduce((curr, prev) => curr + ", " + prev)}]`;
}

function toString(emojiConfiguration: EmojiConfiguration, delimiter = " | ") {
  function rowString(row: RowNumber) {
    return emojiConfiguration[row].map(it => it as string).reduce((prev, curr) => (prev) + delimiter + curr);
  }

  const columns = `A${delimiter}B${delimiter}C${delimiter}D${delimiter}E${delimiter}F${delimiter}G${delimiter}H`;
  return `   ${columns}
        8: ${rowString(8)} :8
        7: ${rowString(7)} :7
        6: ${rowString(6)} :6
        5: ${rowString(5)} :5
        4: ${rowString(4)} :4
        3: ${rowString(3)} :3
        2: ${rowString(2)} :2
        1: ${rowString(1)} :1
           ${columns}`;
}

function toEmojiConfigStringForMoveAssertion(emojiConfiguration: EmojiConfiguration, delimiter = " | ") {
  function rowString(row: RowNumber) {
    return emojiConfiguration[row].map(it => it as string).reduce((prev, curr) => (prev) + delimiter + curr);
  }

  const columns = `A${delimiter}B${delimiter}C${delimiter}D${delimiter}E${delimiter}F${delimiter}G${delimiter}H`;
  return `   ${columns}
        8:\t${rowString(8)}\t:8
        
        7:\t${rowString(7)}\t:7
        
        6:\t${rowString(6)}\t:6
        
        5:\t${rowString(5)}\t:5
        
        4:\t${rowString(4)}\t:4
        
        3:\t${rowString(3)}\t:3
        
        2:\t${rowString(2)}\t:2
        
        1:\t${rowString(1)}\t:1
        
           ${columns}`;
}

function toMoveAssertionString(emojiConfiguration: EmojiMoveAssertion) {
  function rowString(row: RowNumber) {
    return emojiConfiguration[row].map(it => it as string).reduce((prev, curr) => (prev) + "\t" + curr);
  }

  return `   \tA\tB\tC\tD\tE\tF\tG\tH
  
        8:\t${rowString(8)}\t:8
        
        7:\t${rowString(7)}\t:7
        
        6:\t${rowString(6)}\t:6
        
        5:\t${rowString(5)}\t:5
        
        4:\t${rowString(4)}\t:4
        
        3:\t${rowString(3)}\t:3
        
        2:\t${rowString(2)}\t:2
        
        1:\t${rowString(1)}\t:1
        
           \tA\tB\tC\tD\tE\tF\tG\tH`;
}


