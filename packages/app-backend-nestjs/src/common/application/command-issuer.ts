export class CommandIssuer {
  private readonly TYPE = 'CommandIssuer';

  private constructor(readonly username: string, readonly id: string) {
  }

  static withUsername(username: string): CommandIssuer {
    return new CommandIssuer(username, undefined);
  }

  static with(issuerInfo: { id?: string, username?: string }) {
    return new CommandIssuer(issuerInfo.username, issuerInfo.id);
  }

  static anonymous(): CommandIssuer {
    return new CommandIssuer('Anonymous', 'anonymous');
  }
}
