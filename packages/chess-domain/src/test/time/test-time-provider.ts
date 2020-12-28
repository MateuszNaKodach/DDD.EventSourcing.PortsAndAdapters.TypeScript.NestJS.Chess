import { TimeProvider } from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export class TestTimeProvider implements TimeProvider {

  constructor(private readonly provider: () => Date = () => new Date()) {
  }

  currentDate(): Date {
    return this.provider();
  }

}
