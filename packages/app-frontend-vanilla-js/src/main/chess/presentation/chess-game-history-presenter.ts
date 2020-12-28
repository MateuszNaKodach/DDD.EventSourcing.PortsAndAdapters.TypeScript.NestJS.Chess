import { ChessGameHistoryMvp } from "./chess-game-history-mvp";

export class ChessGameHistoryPresenter implements ChessGameHistoryMvp.Presenter {

  constructor(private readonly model: ChessGameHistoryMvp.Model, private readonly view: ChessGameHistoryMvp.View) {
  }

  undoLastMove(): void {
    this.model.undoLastMove();
    this.view.onLastMoveUndone();
  }

}
