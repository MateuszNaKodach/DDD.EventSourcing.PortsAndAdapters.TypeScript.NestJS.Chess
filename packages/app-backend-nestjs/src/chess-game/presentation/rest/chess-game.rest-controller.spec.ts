import { Test, TestingModule } from '@nestjs/testing';
import { ChessGameRestController } from './chess-game.rest-controller';
import { APPLICATION_COMMAND_BUS } from '../../../shared-kernel/application/command/application-command-bus';
import { CommandResult } from '../../../common/application/command-result';
import { StartChessGame } from '../../application/start-chess-game.command';
import { TargetId } from '../../../common/application/target-id';
import { CommandId } from '../../../common/application/command-id';
import { BadRequestException } from '@nestjs/common';

describe('ChessGameRestController', () => {
  const commandBusStub = {
    execute: jest.fn(),
  };
  let chessGameRestController: ChessGameRestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChessGameRestController],
      providers: [{
        provide: APPLICATION_COMMAND_BUS,
        useValue: commandBusStub,
      }],
    }).compile();

    chessGameRestController = app.get<ChessGameRestController>(ChessGameRestController);
  });

  afterEach(()=>{
    commandBusStub.execute.mockClear()
  })

  describe('startChessGame', () => {
    describe('Given | Command which will be accepted', () => {

      const givenRequest = {
        headers: {
          correlationId: 'starting-chess-game-process-correlation-id',
        },
        params: {
          chessGameId: 'given-chess-game-id',
        },
        body: {
          whitePlayerId: 'given-white-player-id',
          blackPlayerId: 'given-black-player-id',
        },
      };

      beforeEach(() => {
        commandBusStub.execute.mockResolvedValue(CommandResult.accepted());
      });

      describe('When | Execute request', () => {

        let response;

        beforeEach(() => {
          response = chessGameRestController.startChessGame(givenRequest.headers.correlationId, givenRequest.params, givenRequest.body);
        });

        it('then should response with chess game id passed in request', () => {
          return expect(response).resolves.toStrictEqual({ chessGameId: 'given-chess-game-id' });
        });

        it('then should execute StartChessGame command', () => {
          expect(commandBusStub.execute).toBeCalled();
          const executedCommand: StartChessGame = commandBusStub.execute.mock.calls[0][0];
          expect(executedCommand).toBeInstanceOf(StartChessGame);
          expect(executedCommand.commandId).toStrictEqual(CommandId.of('starting-chess-game-process-correlation-id'));
          expect(executedCommand.targetId).toStrictEqual(TargetId.of('given-chess-game-id'));
          expect(executedCommand.data).toStrictEqual({
            whitePlayerId: 'given-white-player-id',
            blackPlayerId: 'given-black-player-id',
          });

        });

      });

    });

    describe('Given | Command which will be rejected', () => {

      const givenRequest = {
        headers: {
          correlationId: 'starting-chess-game-process-correlation-id',
        },
        params: {
          chessGameId: 'given-chess-game-id',
        },
        body: {
          whitePlayerId: 'given-white-player-id',
          blackPlayerId: 'given-black-player-id',
        },
      };

      beforeEach(() => {
        commandBusStub.execute.mockResolvedValue(CommandResult.rejected());
      });

      describe('When | Execute request', () => {

        let response;

        beforeEach(() => {
          response = chessGameRestController.startChessGame(givenRequest.headers.correlationId, givenRequest.params, givenRequest.body);
        });

        it('then should response with error message', () => {
          return expect(response).rejects.toStrictEqual(new BadRequestException('Request rejected!'));
        });

        it('then should execute StartChessGame command', () => {
          expect(commandBusStub.execute).toBeCalled();
          const executedCommand: StartChessGame = commandBusStub.execute.mock.calls[0][0];
          expect(executedCommand).toBeInstanceOf(StartChessGame);
          expect(executedCommand.commandId).toStrictEqual(CommandId.of('starting-chess-game-process-correlation-id'));
          expect(executedCommand.targetId).toStrictEqual(TargetId.of('given-chess-game-id'));
          expect(executedCommand.data).toStrictEqual({
            whitePlayerId: 'given-white-player-id',
            blackPlayerId: 'given-black-player-id',
          });

        });

      });

    });
  });
});
