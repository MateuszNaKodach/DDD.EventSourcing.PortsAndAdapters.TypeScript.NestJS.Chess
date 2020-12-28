import WebChessGameView from "./chess/presentation/web-chess-game-view";
import {ChessGame} from "@ddd-es-ts-chess/chess-domain";

declare global {
  interface Window { view: WebChessGameView; chessGame: ChessGame }
}
