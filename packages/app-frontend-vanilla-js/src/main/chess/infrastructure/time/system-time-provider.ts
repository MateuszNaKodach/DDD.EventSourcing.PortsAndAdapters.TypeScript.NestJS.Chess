import {TimeProvider} from "@ddd-es-ts-chess/ddd-building-blocks-domain";

export class SystemTimeProvider implements TimeProvider {
  currentDate(): Date {
    return new Date();
  }
}
