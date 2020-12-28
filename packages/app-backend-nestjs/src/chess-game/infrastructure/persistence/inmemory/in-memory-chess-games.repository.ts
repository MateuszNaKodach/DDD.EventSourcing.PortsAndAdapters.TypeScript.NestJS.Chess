import { ChessGames } from '../../../application/chess-games.repository';
import { ChessGame } from '@ddd-es-ts-chess/chess-domain';
import { TimeProvider } from '@ddd-es-ts-chess/ddd-building-blocks-domain';

export class InMemoryChessGames implements ChessGames {

  constructor(private readonly timeProvider: TimeProvider, private readonly games: { [chessGameId: string]: ChessGame } = {}) {
  }

  static empty(props: { timeProvider: TimeProvider }): InMemoryChessGames {
    return new InMemoryChessGames(props.timeProvider, {});
  }

  findById(id: ChessGame['id']): Promise<ChessGame | undefined> {
    return Promise.resolve(this.games[id.raw]);
  }

  findByIdOrDefault(id: ChessGame['id']): Promise<ChessGame> {
    return Promise.resolve(this.games[id.raw] || ChessGame.with({ timeProvider: this.timeProvider }));
  }

  save(chessGame: ChessGame): Promise<ChessGame> {
    this.games[chessGame.id.raw] = chessGame;
    return Promise.resolve(chessGame);
  }

}
