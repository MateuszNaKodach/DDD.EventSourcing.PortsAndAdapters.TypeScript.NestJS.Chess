import { v4 as uuid } from "uuid";

export class CommandId {
  private readonly TYPE = 'CommandId';

  private constructor(readonly raw: string) {}

  static generate(): CommandId {
    return new CommandId(uuid());
  }

  static of(raw: string): CommandId {
    return new CommandId(raw);
  }
}
