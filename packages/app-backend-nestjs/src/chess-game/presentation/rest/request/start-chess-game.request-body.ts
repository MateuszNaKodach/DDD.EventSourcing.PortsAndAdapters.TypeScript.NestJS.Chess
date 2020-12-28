export class StartChessGameRequestBody {
  whitePlayerId: string;
  blackPlayerId: string;


  constructor(whitePlayerId: string, blackPlayerId: string) {
    this.whitePlayerId = whitePlayerId;
    this.blackPlayerId = blackPlayerId;
  }
}
