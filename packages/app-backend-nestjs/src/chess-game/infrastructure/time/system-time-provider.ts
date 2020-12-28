import { TimeProvider } from '@ddd-es-ts-chess/ddd-building-blocks-domain';

export const TIME_PROVIDER = Symbol('TIME_PROVIDER');

export class SystemTimeProvider implements TimeProvider {
  currentDate(): Date {
    return new Date();
  }
}
