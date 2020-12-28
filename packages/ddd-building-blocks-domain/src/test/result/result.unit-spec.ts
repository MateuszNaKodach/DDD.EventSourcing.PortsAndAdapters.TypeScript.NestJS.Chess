import { Result } from "../../main/result";
import { SampleAggregateId, SampleDomainEvent } from "../aggregate-mutable/sample-aggregate-root.test-utils";
import { CausationId } from "../../main/event";
import 'jest-extended';

describe('Feature: Aggregate command result', () => {
  describe('Scenario: Result success', () => {

    describe('Given: Empty success', () => {
      const emptySuccessResult = Result.success();

      it('Then: Result should have no events', () => {
        expect(emptySuccessResult.events).toBeEmpty();
      });

      it('Then: Result should have no failure reason', () => {
        expect(emptySuccessResult.failureReason()).toBeUndefined();
      });
    });

    describe('Given: Success with one event', () => {
      const causationId = CausationId.generate();
      const correlationId = causationId.toCorrelation()
      const metadata = {causationId, correlationId}
      const successEvent = SampleDomainEvent.SomethingWithoutEventHandlerHappened.event(SampleAggregateId.of("id"), new Date(), {}, metadata)
      const emptySuccessResult = Result.success(successEvent);

      it('Then: Result should have 1 event', () => {
        expect(emptySuccessResult.events).toHaveLength(1);
      });

      it('Then: Result should have event equals to given', () => {
        expect(emptySuccessResult.events).toContain(successEvent)
      });

      it('Then: Result should have no failure reason', () => {
        expect(emptySuccessResult.failureReason()).toBeUndefined();
      });

      describe("When: Concat result with another success", () => {
        const anotherEvents = [
          SampleDomainEvent.SomethingWithoutEventHandlerHappened.event(SampleAggregateId.of("id"), new Date(), {}, metadata),
          SampleDomainEvent.SomethingWithoutEventHandlerHappened.event(SampleAggregateId.of("id"), new Date(), {}, metadata)
        ]
        const anotherSuccess = Result.success(anotherEvents)
        const concatResult = emptySuccessResult.also(anotherSuccess)

        it('Then: Result should have events like in two results', () => {
          expect(concatResult.events).toIncludeSameMembers([successEvent, ...anotherEvents])
        });

      })
    });

  });
});
