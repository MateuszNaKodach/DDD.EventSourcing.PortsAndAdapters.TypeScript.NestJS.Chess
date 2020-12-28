import { Module } from '@nestjs/common';
import { SharedKernelInfrastructureModule } from '../infrastructure/shared-kernel-infrastructure.module';
import { APPLICATION_COMMAND_BUS } from './command/application-command-bus';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { DeduplicatingApplicationCommandBus } from './command/deduplicating-application-command-bus';
import { DOMAIN_EVENT_BUS } from './event/domain-event-bus';
import { LoggingDomainEventBus } from './event/logging-domain-event-bus';

@Module({
  imports: [
    SharedKernelInfrastructureModule,
  ],
  providers: [
    {
      provide: APPLICATION_COMMAND_BUS,
      inject: [CommandBus],
      useFactory: (commandBus: CommandBus) =>
        //new ClassValidatorApplicationCommandBus(
          new DeduplicatingApplicationCommandBus(commandBus),
        //),
    },
    {
      provide: DOMAIN_EVENT_BUS,
      inject: [EventBus],
      useFactory: (eventBus: EventBus) => new LoggingDomainEventBus(eventBus),
    },
  ],
  exports: [APPLICATION_COMMAND_BUS, DOMAIN_EVENT_BUS],
})
export class SharedKernelApplicationModule {

}
