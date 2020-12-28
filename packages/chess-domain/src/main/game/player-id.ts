export class PlayerId {
  TYPE = "PlayerId"

  constructor(private readonly raw: string) {
  }

  static of(raw: string){
    return new PlayerId(raw);
  }

  toString() {
    return this.raw;
  }

  equals(another: PlayerId | undefined){
    return another !== undefined && another.raw.toLowerCase() === this.raw.toLowerCase();
  }
}
