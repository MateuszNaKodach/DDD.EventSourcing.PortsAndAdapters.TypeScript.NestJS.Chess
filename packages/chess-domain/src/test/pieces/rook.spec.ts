import { Rook, Side } from '../../main/pieces';
import { EmojiChessBoardTestCase } from '../domain-test-dsl/board-spec.dsl';

describe('Rook', () => {
  const rookName = 'Rook';
  const whiteRook = new Rook(Side.WHITE);
  const blackRook = new Rook(Side.BLACK);

  it(`should be named ${rookName}`, () => {
    expect(whiteRook.name).toBe(rookName);
    expect(blackRook.name).toBe(rookName);
  });

  EmojiChessBoardTestCase.givenChessBoard({
    8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  })
    .whenPick({ piece: '♖', on: 'A1' })
    .thenNormalMoveIsNotAvailable()
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: '♖', on: 'H1' })
    .thenNormalMoveIsNotAvailable()
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: '♜', on: 'A8' })
    .thenNormalMoveIsNotAvailable()
    .thenAttackMoveIsNotAvailable()
    .and()
    .whenPick({ piece: '♜', on: 'H8' })
    .thenNormalMoveIsNotAvailable()
    .thenAttackMoveIsNotAvailable()
    .asTest('should not be available to move on start');

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', '♟', ' ', ' ', ' ', ' '],
    4: [' ', ' ', '♟', '♖', '♟', ' ', ' ', ' '],
    3: [' ', ' ', ' ', '♟', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  }).thenExpectMoves({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', '🗡️', ' ', ' ', ' ', ' '],
    4: [' ', ' ', '🗡️', '♖', '🗡️', ' ', ' ', ' '],
    3: [' ', ' ', ' ', '🗡️', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  }).asTest('should not skip enemy chess');

  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♖', ' ', ' ', ' ', ' '],
    3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  }).thenExpectMoves({
    8: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    5: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    4: ['👟', '👟', '👟', '♖', '👟', '👟', '👟', '👟'],
    3: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    2: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', '👟', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  }).asTest('should be available to move horizontally and vertically');
});
