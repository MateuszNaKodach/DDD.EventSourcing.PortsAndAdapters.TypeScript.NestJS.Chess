import { Module } from '@nestjs/common';
import { SystemTimeProvider, TIME_PROVIDER } from './system-time-provider';

@Module({
  providers: [
    {
      provide: TIME_PROVIDER,
      useClass: SystemTimeProvider,
    },
  ],
  exports: [TIME_PROVIDER],
})
export class TimeProviderModule {

}
