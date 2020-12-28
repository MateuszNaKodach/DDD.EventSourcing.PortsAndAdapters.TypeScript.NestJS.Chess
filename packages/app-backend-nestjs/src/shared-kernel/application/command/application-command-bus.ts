import { Command } from '../../../common/application/command';
import { CommandResult } from '../../../common/application/command-result';

export const APPLICATION_COMMAND_BUS = Symbol('APPLICATION_COMMAND_BUS');

export interface ApplicationCommandBus {
  execute<CommandType extends Command<any>>(command: CommandType): Promise<CommandResult>;
}
