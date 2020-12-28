import {Command} from "./command";
import {CommandId} from "./command-id";
import {CommandIssuer} from "./command-issuer";
import {TargetId} from "./target-id";

export abstract class AbstractCommand<T = any> implements Command<T> {
  readonly commandId: CommandId;
  readonly issuedAt: Date;
  readonly issuedBy: CommandIssuer;
  readonly targetId: TargetId;
  readonly data: T;

  constructor(commandId: CommandId, issuedAt: Date, issuedBy: CommandIssuer, targetId: TargetId, data: T) {
    this.commandId = commandId;
    this.issuedAt = issuedAt;
    this.issuedBy = issuedBy;
    this.targetId = targetId;
    this.data = data;
  }

  get commandType(): string {
    return Object.getPrototypeOf(this).constructor.name;
  }

  abstract get targetType(): string;
}
