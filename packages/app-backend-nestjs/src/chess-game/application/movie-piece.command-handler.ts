import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandResult } from '../../common/application/command-result';
import { CHESS_GAMES_REPOSITORY, ChessGames } from './chess-games.repository';
import { ChessGameId, PlayerId, Square } from '@ddd-es-ts-chess/chess-domain';
import { Inject } from '@nestjs/common';
import { MovePiece } from './move-piece.command';
import { DOMAIN_EVENT_BUS, DomainEventBus } from '../../shared-kernel/application/event/domain-event-bus';

@CommandHandler(MovePiece)
export class MoviePieceCommandHandler implements ICommandHandler<MovePiece> {

  constructor(
    @Inject(CHESS_GAMES_REPOSITORY)
    private readonly chessGames: ChessGames,
    @Inject(DOMAIN_EVENT_BUS)
    private readonly domainEventBus: DomainEventBus
  ) {
  }

  //TODO: Można eventy wyciagac w repository. Mozna do repository przekazywac tylko eventy bo i tak one beda robic zmiany SQL
  async execute(command: MovePiece): Promise<CommandResult> {
    const chessGameId = ChessGameId.of(command.targetId.raw);
    const chessGame = await this.chessGames.findByIdOrDefault(chessGameId);
    const result = chessGame.movePiece({
      by: PlayerId.of(command.issuedBy.id),
      from: Square.fromAlgebraicNotation(command.data.fromSquare),
      to: Square.fromAlgebraicNotation(command.data.toSquare),
    });
    //TODO: Transaction start
    await this.domainEventBus.publishAll(result.events);
    await this.chessGames.save(chessGame);
    //TODO: Transaction end
    return result.isSuccess() ? CommandResult.accepted() : CommandResult.rejected();
  }

}
