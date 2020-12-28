import {AbstractCommand} from "../../common/application/abstract-command";
import {CommandId} from "../../common/application/command-id";
import {CommandIssuer} from "../../common/application/command-issuer";
import {TargetId} from "../../common/application/target-id";

export type MovePieceData = {
  fromSquare: string;
  toSquare: string;
}

export class MovePiece extends AbstractCommand<MovePieceData> {
  private readonly TYPE = 'MovePiece';

  static command(props: { issuedAt?: Date, issuedBy?: CommandIssuer, targetId: TargetId, data: MovePieceData, commandId?: CommandId }): MovePiece {
    return new MovePiece(props.commandId ?? CommandId.generate(), props.issuedAt ?? new Date(), props.issuedBy ?? CommandIssuer.anonymous(), props.targetId, props.data);
  }

  get targetType(): string {
    return "ChessGame";
  }
}
