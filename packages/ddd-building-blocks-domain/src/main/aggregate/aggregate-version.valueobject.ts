export class AggregateVersion {
  private readonly TYPE = "AggregateVersion";

  private constructor(readonly raw: number) {
  }

  static of(raw: number): AggregateVersion {
    if (raw < 0 || !AggregateVersion.isInteger(raw)) {
      throw new Error("Aggregate version number must be integer >= 0!");
    }
    return new AggregateVersion(raw);
  }

  static new(): AggregateVersion {
    return new AggregateVersion(0);
  }

  increase(): AggregateVersion {
    return new AggregateVersion(this.raw + 1);
  }

  private static isInteger(n: any) {
    return n % 1 === 0;
  }
}
