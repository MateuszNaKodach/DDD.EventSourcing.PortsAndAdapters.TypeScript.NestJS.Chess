import {TimeProvider} from "../../main/time";
import {expectDomainEvent} from "../../main/test";
import {SampleAggregateId, SampleAggregateRoot, SampleDomainEvent} from "./sample-aggregate-root.test-utils";

describe('Feature: Event Sourced Mutable Aggregate Root', () => {
  const timeProvider: TimeProvider = {
    currentDate(): Date {
      return new Date()
    }
  };
  const sampleAggregateId = SampleAggregateId.of('SampleAggregateId');
  let sampleAggregateRoot: SampleAggregateRoot;

  beforeEach(() => {
    sampleAggregateRoot = new SampleAggregateRoot(timeProvider);
  });

  describe('Given: Sample aggregate root', () => {
    const command = {
      stringVariable: 'string',
      numberVariable: 123,
    };

    describe('When: Invoke method with handler', () => {
      beforeEach(() => {
        sampleAggregateRoot.doSomething(sampleAggregateId, {
          ...command,
        });
      });

      it('Then: Event should be applied', () => {
        expectDomainEvent(sampleAggregateRoot, {
          type: SampleDomainEvent.SomethingHappened,
          data: command,
        });
      });
    });

    describe('When: Invoke method without handler', () => {
      it('Then: Event should not be applied', () => {
        expect(() => sampleAggregateRoot.doSomethingWithoutEventHandler())
            .toThrow('Handler for domain event SomethingWithoutEventHandlerHappened not found!');
      });
    });
  });
});
