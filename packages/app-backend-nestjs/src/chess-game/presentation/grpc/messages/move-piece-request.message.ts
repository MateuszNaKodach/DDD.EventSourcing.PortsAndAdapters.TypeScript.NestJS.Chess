export interface MovePieceRequest {
  chessGameId: string;
  fromSquare: string;
  toSquare: string;
  correlationId: string;
}
