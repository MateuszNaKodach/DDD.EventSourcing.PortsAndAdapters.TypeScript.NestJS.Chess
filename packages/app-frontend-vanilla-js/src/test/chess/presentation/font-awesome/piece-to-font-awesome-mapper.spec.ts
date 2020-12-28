import FontAwesomePieceIcons from "../../../../main/chess/presentation/font-awesome/font-awesome-piece-icons";
import {PieceName} from "@ddd-es-ts-chess/chess-domain";
import {Side} from "@ddd-es-ts-chess/chess-domain";

type PieceMapperTestCase = { piece: { name: PieceName, side: Side }, fontAwesome: string }

describe('PieceMapper | Name and side to font awesome', () => {

  const testCases: PieceMapperTestCase[] = [
    {piece: {name: 'King', side: Side.BLACK}, fontAwesome: `<i class="fas fa-chess-king black"></i>`},
    {piece: {name: 'Queen', side: Side.BLACK}, fontAwesome: `<i class="fas fa-chess-queen black"></i>`},
    {piece: {name: 'Bishop', side: Side.BLACK}, fontAwesome: `<i class="fas fa-chess-bishop black"></i>`},
    {piece: {name: 'Knight', side: Side.BLACK}, fontAwesome: `<i class="fas fa-chess-knight black"></i>`},
    {piece: {name: 'Rook', side: Side.BLACK}, fontAwesome: `<i class="fas fa-chess-rook black"></i>`},
    {piece: {name: 'Pawn', side: Side.BLACK}, fontAwesome: `<i class="fas fa-chess-pawn black"></i>`},
    {piece: {name: 'King', side: Side.WHITE}, fontAwesome: `<i class="fas fa-chess-king white"></i>`},
    {piece: {name: 'Queen', side: Side.WHITE}, fontAwesome: `<i class="fas fa-chess-queen white"></i>`},
    {piece: {name: 'Bishop', side: Side.WHITE}, fontAwesome: `<i class="fas fa-chess-bishop white"></i>`},
    {piece: {name: 'Knight', side: Side.WHITE}, fontAwesome: `<i class="fas fa-chess-knight white"></i>`},
    {piece: {name: 'Rook', side: Side.WHITE}, fontAwesome: `<i class="fas fa-chess-rook white"></i>`},
    {piece: {name: 'Pawn', side: Side.WHITE}, fontAwesome: `<i class="fas fa-chess-pawn white"></i>`},
  ]

  testCases.map(testCase => {
    it(`${testCase.piece.side} ${testCase.piece.name} in font awesome should be ${testCase.fontAwesome}`, () => {
      expect(FontAwesomePieceIcons.getBy(testCase.piece.name, testCase.piece.side)).toEqual(testCase.fontAwesome)
    })
  })

})
