import { EmojiChessBoardTestCase } from "../../domain-test-dsl/board-spec.dsl";
import {Side} from "../../../main/pieces";
import { castlingPattern } from "../../../main/pieces";

describe("Castling: King and Rook special move", () => {

  describe("White King", () => {

    it("impossible on starting", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves([])
    })

    it("queen side empty and not in check", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', '♙', '♙', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', '♘', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♗', '♕', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', ' ', ' ', ' ', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves(["C1"])
    })

    it("queen and king side empty and not in check", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', '♙', '♙', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', '♘', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♗', '♕', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', ' ', ' ', ' ', '♔', ' ', ' ', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves(["C1", "G1"])
    })

    it("queen and king side empty, but queen side king square after move checked", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', '♙', '♙', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', '♘', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', ' ', '♜', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', ' ', ' ', ' ', '♔', ' ', ' ', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves(["G1"])
    })

    it("queen and king side empty, but queen side king square between move checked", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', '♙', '♙', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', '♘', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', ' ', ' ', '♜', '♙', '♙', '♙', '♙'],
        1: ['♖', ' ', ' ', ' ', '♔', ' ', ' ', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves(["G1"])
    })

    it("queen and king side empty, but both sides king square between move checked", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', '♙', '♙', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', '♘', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', ' ', ' ', '♜', '♙', '♜', '♙', '♙'],
        1: ['♖', ' ', ' ', ' ', '♔', ' ', ' ', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves([])
    })

    it("queen and king side empty, but king is checked", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', '♙', '♙', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', '♘', ' ', '♜', ' ', ' ', ' '],
        2: ['♙', ' ', ' ', ' ', ' ', '♙', '♙', '♙'],
        1: ['♖', ' ', ' ', ' ', '♔', ' ', ' ', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♔", on: "E1"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves([])
    })



  })

  describe("Black King", () => {

    it("impossible on starting", () => {
      EmojiChessBoardTestCase.givenChessBoard({
        8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
        6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
        0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }).whenPick({piece: "♚", on: "E8"})
          .whenGetMovesBy(((chessBoard, piece, square) => castlingPattern(Side.WHITE, chessBoard, square)))
          .assertGetMoves([])
    })
  })

})
