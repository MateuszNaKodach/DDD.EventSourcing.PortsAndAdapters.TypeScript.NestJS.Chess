import { ApplicationCommandBus } from './application-command-bus';
import { Command } from '../../../common/application/command';
import { validateOrReject } from 'class-validator';
import { ValidationError } from 'class-validator';
import { CommandResult } from '../../../common/application/command-result';

export class ClassValidatorApplicationCommandBus implements ApplicationCommandBus {

  constructor(private readonly applicationCommandBus: ApplicationCommandBus) {
  }

  execute<CommandType extends Command<any>>(command: CommandType): Promise<CommandResult> {
    return validateOrReject(command)
      .catch(validationError => {
        throw new ApplicationCommandInvalidSchemaException(command, validationError);
      })
      .then(() => this.applicationCommandBus.execute<CommandType>(command));
  }

}

export class Exception extends Error {
  constructor(message: string, private readonly causation: Error | undefined = undefined) {
    super(message);
    this.stack = causation ? Exception.errorCausedBy(this, causation).stack : this.stack;
  }

  causedBy(causation: Error): Exception {
    return new Exception(Exception.errorCausedBy(this, causation).message, causation);
  }

  private static errorCausedBy(error: Error, causation: Error): Error {
    error.stack += '\nCaused by: \n' + causation.message + '\n' + causation.stack;
    return error;
  }
}

export class ApplicationCommandInvalidSchemaException extends Exception {
  constructor(command: Command, readonly validationErrors: ValidationError[]) {
    super(
      `Application command ${command.commandType} rejected! Schema doesn't match. \n Validation errors: ${validationErrors.map(
        (it, index) => `\n${index + 1}. ${it}`,
      )}`,
    );
  }
}
