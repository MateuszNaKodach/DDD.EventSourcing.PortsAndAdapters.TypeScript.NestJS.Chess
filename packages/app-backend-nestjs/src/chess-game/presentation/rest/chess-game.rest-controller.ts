import { BadRequestException, Body, Controller, Get, Headers, Inject, Param, Post, Put } from '@nestjs/common';
import { MoviePieceRequestBody } from './request/movie-piece.request-body';
import { StartChessGameRequestBody } from './request/start-chess-game.request-body';
import { StartChessGameResponseBody } from './response/start-chess-game.response-body';
import { StartChessGame } from '../../application/start-chess-game.command';
import { TargetId } from '../../../common/application/target-id';
import { MovePieceRequestParams } from './request/move-piece.request-params';
import { CommandResult, CommandStatus } from '../../../common/application/command-result';
import { MovePiece } from '../../application/move-piece.command';
import { ChessGameId } from '@ddd-es-ts-chess/chess-domain';
import { StartChessGameRequestParams } from './request/start-chess-game.request-params';
import { CommandId } from '../../../common/application/command-id';
import {
  APPLICATION_COMMAND_BUS,
  ApplicationCommandBus,
} from '../../../shared-kernel/application/command/application-command-bus';


@Controller('/rest-api/chess-game')
export class ChessGameRestController {

  constructor(
    @Inject(APPLICATION_COMMAND_BUS)
    private readonly commandBus: ApplicationCommandBus,
  ) {
  }

  @Get()
  async getHello() {
    return ChessGameId.generate();
  }

  @Put('/:chessGameId/')
  async startChessGame(
    @Headers('x-correlationId') correlationId: string,
    @Param() params: StartChessGameRequestParams,
    @Body() requestBody: StartChessGameRequestBody,
  ): Promise<StartChessGameResponseBody> {
    const command = StartChessGame.command({
      commandId: CommandId.of(correlationId),
      targetId: TargetId.of(params.chessGameId),
      data: {
        whitePlayerId: requestBody.whitePlayerId,
        blackPlayerId: requestBody.blackPlayerId,
      },
    });
    const commandResult: CommandResult = await this.commandBus.execute(command);
    if (commandResult.status == CommandStatus.REJECTED) {
      throw new BadRequestException('Request rejected!');
    }
    return { chessGameId: params.chessGameId };
  }

  @Post('/:chessGameId/moves')
  async movePiece(
    @Headers('x-correlationId') correlationId: string,
    @Param() params: MovePieceRequestParams,
    @Body() requestBody: MoviePieceRequestBody,
  ): Promise<void> {
    const chessGameId = params.chessGameId;
    const command = MovePiece.command({
      commandId: CommandId.of(correlationId),
      targetId: TargetId.of(chessGameId),
      data: {
        fromSquare: requestBody.fromSquare,
        toSquare: requestBody.toSquare,
      },
    });
    const commandResult: CommandResult = await this.commandBus.execute(command);
    if (commandResult.status == CommandStatus.REJECTED) {
      throw new BadRequestException('Request rejected!');
    }
  }

}
