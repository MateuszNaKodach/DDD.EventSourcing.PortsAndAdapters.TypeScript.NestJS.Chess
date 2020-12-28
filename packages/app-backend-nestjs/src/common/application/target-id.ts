export class TargetId {
  private readonly TYPE = 'TargetId';

  private constructor(readonly raw: string) {}

  static of(raw: string): TargetId {
    return new TargetId(raw);
  }
}
