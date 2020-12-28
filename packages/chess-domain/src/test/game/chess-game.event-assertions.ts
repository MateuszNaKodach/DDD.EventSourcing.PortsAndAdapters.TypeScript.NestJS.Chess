import { ChessBoard } from '../../main/board';
import { Side } from '../../main/pieces';
import { ChessGame } from '../../main/game';
import { ChessGameId } from '../../main/game';
import { board } from '../domain-test-dsl/fixtures';
import { EmojiConfiguration } from '@ddd-es-ts-chess/chess-piece-emoji';
import { TimeProvider } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { Result } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import {
  expectDomainEvent, ExpectedDomainEvent,
} from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { DomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { ChessGameDomainEvent } from '../../main/event';
import { PlayerId } from '../../main/game/player-id';

export const whitePlayer = PlayerId.of(Side.WHITE);
export const blackPlayer = PlayerId.of(Side.BLACK);

export function expectChessBoard<T extends DomainEvent>(
  actual: ChessBoard,
  expected: ChessBoard,
) {
  expect(actual).toEqual(expected);
}

export const given = (props: { currentSide?: Side, board: ChessBoard | EmojiConfiguration, time?: TimeProvider, players?: { white: PlayerId, black: PlayerId } }): GivenChessGame => {
  const timeProvider: TimeProvider = props.time ? props.time : {
    currentDate(): Date {
      return new Date();
    },
  };
  const chessGame = ChessGame.with({ timeProvider });
  chessGame.start({
    chessBoard: props.board instanceof ChessBoard ? props.board : board(props.board),
    id: ChessGameId.generate(),
    startSide: props.currentSide ?? Side.WHITE,
    players: props.players ?? { white: PlayerId.of(Side.WHITE), black: blackPlayer },
  });
  return new GivenChessGame(chessGame);
};

export const givenEvents = (props: { events: ChessGameDomainEvent[], time?: TimeProvider }): GivenChessGame => {
  const timeProvider: TimeProvider = props.time ? props.time : {
    currentDate(): Date {
      return new Date();
    },
  };
  const chessGame = ChessGame.from(props.events)(timeProvider);
  return new GivenChessGame(chessGame);
};

class GivenChessGame {

  constructor(private readonly chessGame: ChessGame) {
  }

  whenCommand = (command: (game: ChessGame) => Result): CommandResultAssertion => {
    const result = command(this.chessGame);
    return new CommandResultAssertion(result, this.chessGame.board);
  };

  thenBoard<T extends DomainEvent>(expectedBoard: ChessBoard) {
    if (!this.chessGame.board) {
      throw new Error('No board in assertion!');
    }
    expectChessBoard(this.chessGame.board, expectedBoard);
    return this;
  }

}

export const whenCommand = (command: () => Result): CommandResultAssertion => {
  const result = command();
  return new CommandResultAssertion(result);
};

class CommandResultAssertion {

  constructor(private readonly result: Result, private readonly board?: ChessBoard) {
  }

  thenEvent<T extends DomainEvent>(expected: ExpectedDomainEvent<T>) {
    expectDomainEvent(this.result, expected);
    return this;
  }

  thenBoard<T extends DomainEvent>(expectedBoard: ChessBoard) {
    if (!this.board) {
      throw new Error('No board in assertion!');
    }
    expectChessBoard(this.board, expectedBoard);
    return this;
  }

}
