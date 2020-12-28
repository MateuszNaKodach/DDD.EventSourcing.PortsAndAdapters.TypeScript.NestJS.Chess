import { ChessGame } from '@ddd-es-ts-chess/chess-domain';

export const CHESS_GAMES_REPOSITORY = Symbol();

export interface ChessGames {

  findById(id: ChessGame['id']): Promise<ChessGame | undefined>

  findByIdOrDefault(id: ChessGame['id']): Promise<ChessGame>

  save(chessGame: ChessGame): Promise<ChessGame>

}
