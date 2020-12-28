import { ApplicationCommandBus } from './application-command-bus';
import { Command } from '../../../common/application/command';
import { CommandResult } from '../../../common/application/command-result';

export class DeduplicatingApplicationCommandBus implements ApplicationCommandBus {

  //TODO: Different types of deduplicator - inmemory / database itp.
  private readonly resultByCommandId: { [commandId: string]: CommandResult } = {};

  constructor(private readonly applicationCommandBus: ApplicationCommandBus) {
  }

  execute<T extends Command<any>>(command: T): Promise<CommandResult> {
    const commandId = command.commandId.raw;
    const resultForExecutingCommand = this.resultByCommandId[commandId];
    if (resultForExecutingCommand) {
      return Promise.resolve(resultForExecutingCommand);
    }
    return this.applicationCommandBus.execute(command)
      .then(result => {
        this.resultByCommandId[commandId] = result;
        return result;
      });
  }

}
