import {AbstractCommand} from "../../common/application/abstract-command";
import {CommandId} from "../../common/application/command-id";
import {CommandIssuer} from "../../common/application/command-issuer";
import {TargetId} from "../../common/application/target-id";

export type StartChessGameData = {
  whitePlayerId: string;
  blackPlayerId: string;
}

export class StartChessGame extends AbstractCommand<StartChessGameData> {
  private readonly TYPE = 'StartChessGame';

  static command(props: { issuedAt?: Date, issuedBy?: CommandIssuer, targetId: TargetId, data: StartChessGameData, commandId?: CommandId }): StartChessGame {
    return new StartChessGame(props.commandId ?? CommandId.generate(), props.issuedAt ?? new Date(), props.issuedBy ?? CommandIssuer.anonymous(), props.targetId, props.data);
  }

  get targetType(): string {
    return "ChessGame";
  }
}
