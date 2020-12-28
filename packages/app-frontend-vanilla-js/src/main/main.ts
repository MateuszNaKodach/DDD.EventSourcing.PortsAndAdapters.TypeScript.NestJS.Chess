import WebChessGameView from './chess/presentation/web-chess-game-view';
import { EmojiChessBoardGenerator } from './chess/infrastructure/board/emoji-chess-board-generator';
import { ChessBoardPresenter } from './chess/presentation/chess-board-presenter';
import { ChessGameHistoryPresenter } from './chess/presentation/chess-game-history-presenter';
import { SystemTimeProvider } from './chess/infrastructure/time/system-time-provider';
import { Side } from '@ddd-es-ts-chess/chess-domain';
import { ChessGameId } from '@ddd-es-ts-chess/chess-domain';
import { ChessGame } from '@ddd-es-ts-chess/chess-domain';
import { ChessBoardGenerator, PlayerId } from '@ddd-es-ts-chess/chess-domain';

const chessBoardGenerator: ChessBoardGenerator = new EmojiChessBoardGenerator();
const chessBoard = chessBoardGenerator.generate();
const chessGame = ChessGame.with({ timeProvider: new SystemTimeProvider() });
chessGame.start({
  chessBoard,
  id: ChessGameId.generate(),
  startSide: Side.WHITE,
  players: { white: PlayerId.of('white'), black: PlayerId.of('black') },
});

const view = new WebChessGameView(
  view => new ChessBoardPresenter(chessGame, view),
  view => new ChessGameHistoryPresenter(chessGame, view));

window.view = view;
window.chessGame = chessGame;
