export namespace ChessGameHistoryMvp {
  export interface Model {

    undoLastMove(): void;
  }

  export interface Presenter {

    undoLastMove(): void;
  }

  export interface View {
    onLastMoveUndone():void;
  }
}
