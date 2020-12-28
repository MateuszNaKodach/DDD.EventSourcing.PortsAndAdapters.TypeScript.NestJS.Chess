export class CommandResult {

  constructor(readonly status: CommandStatus) {
  }

  static accepted(): CommandResult {
    return new CommandResult(CommandStatus.ACCEPTED);
  }

  static rejected() {
    return new CommandResult(CommandStatus.REJECTED);
  }

  isAccepted() {
    return this.status === CommandStatus.ACCEPTED;
  }
}


export enum CommandStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
