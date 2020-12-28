import {CommandId} from "./command-id";
import {CommandIssuer} from "./command-issuer";
import {TargetId} from "./target-id";

export interface Command<T = any> {
  readonly commandId: CommandId;
  readonly issuedAt: Date;
  readonly issuedBy: CommandIssuer;
  readonly commandType: string;
  readonly targetType: string;
  readonly targetId: TargetId;
  readonly data: T;
}


