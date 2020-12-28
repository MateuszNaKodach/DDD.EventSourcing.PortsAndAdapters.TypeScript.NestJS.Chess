import { ChessGameApplicationModule } from './chess-game-application.module';
import { StartChessGame } from './start-chess-game.command';
import { TargetId } from '../../common/application/target-id';
import { ChessGameStarted, PieceWasMoved } from '@ddd-es-ts-chess/chess-domain';
import { MovePiece } from './move-piece.command';
import { CommandIssuer } from '../../common/application/command-issuer';
import {
  accepted,
  rejected,
  scenario, ThenAssertions,
} from '../../common-testing/module-specification';
import { Command } from '../../common/application/command';
import { CommandId } from '../../common/application/command-id';

describe('Feature: Playing chess game', () => {

  const startChessGame = StartChessGame.command({
    commandId: CommandId.of("start-chess-game-command-id"),
    targetId: TargetId.of('chess-game-id-to-start'),
    data: {
      whitePlayerId: 'white-player-id',
      blackPlayerId: 'black-player-id',
    },
  });

  const movePiece = MovePiece.command({
    commandId: CommandId.of("move-piece-command-id"),
    targetId: TargetId.of('chess-game-id-to-start'),
    issuedBy: CommandIssuer.with({ id: 'white-player-id' }),
    data: {
      fromSquare: 'A2',
      toSquare: 'A3',
    },
  });

  describe('Starting chess game', () => {

    it('should accept command and publish ChessGameStarted', () => {
      return chessGameScenario({
        when: startChessGame,
        then: result => result.thenCommand(accepted).thenEvent({type: ChessGameStarted}),
      });
    });

    it('should be idempotent - allow to process command many times, but repeated executions do not publish event', () => {
      return chessGameScenario({
        givens: [startChessGame, startChessGame, startChessGame],
        when: startChessGame,
        then: result => result.thenCommand(accepted).thenNothingWasPublished(),
      });
    });

  });

  describe('Scenario: Moving piece', () => {

    //FIXME: Fix test
    xit('should reject command and publish nothing, when chess game does not exists', async () => {
      return chessGameScenario({
        when: movePiece,
        then: result => result.thenCommand(rejected).thenNothingWasPublished(),
      });
    });

    it('should accept command and publish PieceWasMoved, when chess game exists', () => {
      return chessGameScenario({
        givens: [startChessGame],
        when: movePiece,
        then: result => result.thenCommand(accepted).thenEvent({type: PieceWasMoved}),
      });
    });

    it('should be idempotent - allow to process command many times, but publish event only once', () => {
      return chessGameScenario({
        givens: [startChessGame, movePiece, movePiece, movePiece],
        when: movePiece,
        then: result => result.thenCommand(accepted).thenNothingWasPublished(),
      });
    })


  });

});

function chessGameScenario(spec: {
  givens?: Command[],
  when: Command,
  then?: (result: ThenAssertions) => any
}) {
  return scenario({
    application: ChessGameApplicationModule,
    ...spec,
  });
}

/*
describe('Feature: Playing chess game', () => {
  let applicationCommandBus: ApplicationCommandBus;
  let domainEventBus: DomainEventBus;
  let domainEventBusSpy;

  beforeEach(async () => {
    const app = await chessGameApplication();
    applicationCommandBus = app.applicationCommandBus;
    domainEventBus = app.domainEventBus;
    domainEventBusSpy = app.domainEventBusSpy;
  });

  describe('Scenario: Starting chess game', () => {
    const command = StartChessGame.command({
      targetId: TargetId.of('chess-game-id-to-start'),
      data: {
        whitePlayerId: 'white-player-id',
        blackPlayerId: 'black-player-id',
      },
    });
    let commandResult;

    beforeEach(() => {
      commandResult = applicationCommandBus.execute(command);
    });


    it('command should be accepted', () => {
      return expect(commandResult).resolves.toStrictEqual(CommandResult.accepted());
    });

    it('ChessGameStarted event should be published', () => {
      expect(domainEventBusSpy.publishAll).toBeCalledTimes(1);
    });

  });

  async function chessGameApplication() {
    return application({ module: ChessGameApplicationModule });
  }

});*/
