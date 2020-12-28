import { Test, TestingModule } from '@nestjs/testing';
import {
  APPLICATION_COMMAND_BUS,
  ApplicationCommandBus,
} from '../shared-kernel/application/command/application-command-bus';
import { DOMAIN_EVENT_BUS, DomainEventBus } from '../shared-kernel/application/event/domain-event-bus';
import { DomainEvent, expectDomainEvent, ExpectedDomainEvent } from '@ddd-es-ts-chess/ddd-building-blocks-domain';
import { Command } from '../common/application/command';
import { CommandResult } from '../common/application/command-result';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export const accepted = CommandResult.accepted();
export const rejected = CommandResult.rejected();

function publishedEvents(domainEventBusSpy: any): DomainEvent[] {
  const result: DomainEvent[] = [];
  domainEventBusSpy.publishAll.mock.calls.map(call => {
    const [publishedEvents] = call;
    result.push(...publishedEvents);
  });
  domainEventBusSpy.publish.mock.calls.map(call => {
    const [publishedEvent] = call;
    result.push(publishedEvent);
  });
  return result;
}

export type ThenAssertions = { thenNothingWasPublished(): void; thenEvent<T extends DomainEvent>(event: ExpectedDomainEvent<T>): void; thenCommand(result: CommandResult): { thenNothingWasPublished(): void; thenEvent<T extends DomainEvent>(event: ExpectedDomainEvent<T>): void; thenCommand(result: CommandResult): any } }

export async function scenario(spec: {
  application: any,
  givens?: Command[],
  when: Command,
  then?: (result: ThenAssertions) => any
}): Promise<ThenAssertions> {
  const { applicationCommandBus, domainEventBus, domainEventBusSpy } = await application({ module: spec.application });
  const publishedEventsList = () => publishedEvents(domainEventBusSpy);
  for (const givenCommand of (spec.givens || [])) {
    await applicationCommandBus.execute(givenCommand);
  }
  domainEventBusSpy.publish.mockClear();
  domainEventBusSpy.publishAll.mockClear();
  const whenCommandResult = await applicationCommandBus.execute(spec.when);
  const thenAssertions: ThenAssertions = {
    thenCommand(result: CommandResult) {
      expect(whenCommandResult).toStrictEqual(result);
      return thenAssertions;
    },
    thenEvent<T extends DomainEvent>(event: ExpectedDomainEvent<T>) {
      expectDomainEvent<T>({ events: publishedEventsList() }, event);
    },
    thenNothingWasPublished() {
      expect(publishedEventsList()).toHaveLength(0);
    },
  };
  if (spec.then) {
    spec.then(thenAssertions);
  }
  return thenAssertions;
}

async function application(props: { module: Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference }) {
  const app: TestingModule = await Test.createTestingModule({
    imports: [props.module],
  }).compile();
  await app.init();
  const applicationCommandBus = app.get<ApplicationCommandBus>(APPLICATION_COMMAND_BUS);
  const domainEventBus = app.get<DomainEventBus>(DOMAIN_EVENT_BUS);
  const domainEventBusSpy = {
    publishAll: jest.spyOn(domainEventBus, 'publishAll'),
    publish: jest.spyOn(domainEventBus, 'publish'),
  };
  return { applicationCommandBus, domainEventBus, domainEventBusSpy };
}

/**
 * @deprecated use scenario function instead
 */
async function moduleSpecification(props: { application: any }) {
  const { applicationCommandBus, domainEventBus, domainEventBusSpy } = await application({ module: props.application });
  const publishedEventsList: () => DomainEvent[] = () => publishedEvents(domainEventBusSpy);

  const whenThen = {
    when: (command: Command) => applicationCommandBus.execute(command)
      .then((commandResult: CommandResult) => ({
        thenCommandResult: (result: CommandResult) => {
          expect(result).toStrictEqual(commandResult);
          return {
            thenPublished<T extends DomainEvent>(event: ExpectedDomainEvent<T>) {
              expectDomainEvent<T>({ events: publishedEventsList() }, event);
            },
            thenNothingWasPublished() {
              expect(publishedEventsList()).toHaveLength(0);
            },
          };
        },
      })),
  };

  const givenWhenThen = {
    given: (command: Command) => applicationCommandBus.execute(command)
      .then(commandResult => {
        domainEventBusSpy.publish.mockClear();
        domainEventBusSpy.publishAll.mockClear();
        return commandResult;
      })
      .then(() => givenWhenThen),
    when: whenThen.when,
  };

  return givenWhenThen;
}
