import { Module } from '@nestjs/common';
import { CHESS_GAMES_REPOSITORY } from '../../../application/chess-games.repository';
import { InMemoryChessGames } from './in-memory-chess-games.repository';
import { TIME_PROVIDER } from '../../time/system-time-provider';
import { TimeProviderModule } from '../../time/time-provider.module';
import { TimeProvider } from '@ddd-es-ts-chess/ddd-building-blocks-domain';

@Module({
  imports: [TimeProviderModule],
  providers: [
    {
      provide: CHESS_GAMES_REPOSITORY,
      inject: [TIME_PROVIDER],
      useFactory: (timeProvider: TimeProvider) => InMemoryChessGames.empty({ timeProvider }),
    },
  ],
  exports: [CHESS_GAMES_REPOSITORY],
})
export class InMemoryPersistenceModule {
}
