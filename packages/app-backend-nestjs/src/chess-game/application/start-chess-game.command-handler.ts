import { StartChessGame } from './start-chess-game.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandResult } from '../../common/application/command-result';
import { CHESS_GAMES_REPOSITORY, ChessGames } from './chess-games.repository';
import { ChessBoard, ChessGameId, PlayerId, Side } from '@ddd-es-ts-chess/chess-domain';
import { Inject } from '@nestjs/common';
import { DOMAIN_EVENT_BUS, DomainEventBus } from '../../shared-kernel/application/event/domain-event-bus';

@CommandHandler(StartChessGame)
export class StartChessGameCommandHandler implements ICommandHandler<StartChessGame> {

  constructor(
    @Inject(CHESS_GAMES_REPOSITORY)
    private readonly chessGames: ChessGames,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly domainEventBus: DomainEventBus,
  ) {
  }

  async execute(command: StartChessGame): Promise<CommandResult> {
    const chessGameId = ChessGameId.of(command.targetId.raw);
    const chessGame = await this.chessGames.findByIdOrDefault(chessGameId);
    const result = chessGame.start({
      chessBoard: ChessBoard.starting(),
      id: chessGameId,
      startSide: Side.WHITE,
      players: {
        white: PlayerId.of(command.data.whitePlayerId),
        black: PlayerId.of(command.data.blackPlayerId),
      },
    });
    await this.domainEventBus.publishAll(result.events);
    await this.chessGames.save(chessGame);
    return result.isSuccess() ? CommandResult.accepted() : CommandResult.rejected();
  }

}
