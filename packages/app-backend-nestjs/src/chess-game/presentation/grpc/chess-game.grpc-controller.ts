import { BadRequestException, Controller, Inject } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { StartChessGameRequest } from './messages/start-chess-game-request.message';
import { StartChessGameResponse } from './messages/start-chess-game-response.message';
import {
  APPLICATION_COMMAND_BUS,
  ApplicationCommandBus,
} from '../../../shared-kernel/application/command/application-command-bus';
import { StartChessGame } from '../../application/start-chess-game.command';
import { CommandId } from '../../../common/application/command-id';
import { TargetId } from '../../../common/application/target-id';
import { CommandResult, CommandStatus } from '../../../common/application/command-result';
import { MovePieceRequest } from './messages/move-piece-request.message';
import { Observable, Subject } from 'rxjs';
import { MovePieceResponse } from './messages/move-piece-response.message';
import { MovePiece } from '../../application/move-piece.command';

//https://docs.nestjs.com/microservices/grpc
@Controller()
export class ChessGameGrpcController {

  constructor(
    @Inject(APPLICATION_COMMAND_BUS)
    private readonly commandBus: ApplicationCommandBus,
  ) {
  }

  @GrpcMethod('ChessGameService', 'StartChessGame')
  async startChessGame(data: StartChessGameRequest, metadata: any): Promise<StartChessGameResponse> {
    const command = StartChessGame.command({
      commandId: CommandId.of(data.correlationId),
      targetId: TargetId.of(data.chessGameId),
      data: {
        whitePlayerId: data.whitePlayerId,
        blackPlayerId: data.blackPlayerId,
      },
    });
    const commandResult: CommandResult = await this.commandBus.execute(command);
    if (commandResult.status == CommandStatus.REJECTED) {
      throw new BadRequestException('Request rejected!');
    }
    return {
      success: commandResult.isAccepted(),
      chessGameId: data.chessGameId,
      correlationId: data.correlationId,
    };
  }

  @GrpcMethod('ChessGameService', 'MovePiece')
  async movePiece(data: MovePieceRequest): Promise<MovePieceResponse> {
    const command = MovePiece.command({
      commandId: CommandId.of(data.correlationId),
      targetId: TargetId.of(data.chessGameId),
      data: {
        fromSquare: data.fromSquare,
        toSquare: data.toSquare,
      },
    });
    const commandResult = await this.commandBus.execute(command);
    return {
      success: commandResult.isAccepted(),
      chessGameId: data.chessGameId,
      correlationId: data.correlationId,
    };
  }

  @GrpcStreamMethod('ChessGameService', 'MovePieces')
  movePieces(data$: Observable<MovePieceRequest>): Observable<MovePieceResponse> {
    const responses$ = new Subject<MovePieceResponse>();

    const onNext = async (request: MovePieceRequest) => {
      const command = MovePiece.command({
        commandId: CommandId.of(request.correlationId),
        targetId: TargetId.of(request.chessGameId),
        data: {
          fromSquare: request.fromSquare,
          toSquare: request.toSquare,
        },
      });
      const commandResult = await this.commandBus.execute(command);
      const response = {
        success: commandResult.isAccepted(),
        chessGameId: request.chessGameId,
        correlationId: request.correlationId,
      };
      responses$.next(response);
    };
    const onComplete = () => responses$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return responses$.asObservable();
  }

}
