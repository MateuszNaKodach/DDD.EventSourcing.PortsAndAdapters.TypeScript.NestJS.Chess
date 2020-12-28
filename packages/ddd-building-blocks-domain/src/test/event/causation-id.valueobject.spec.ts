import {CausationId, DomainEventId} from "../../main/event";

describe("Causation id", () => {

  it("generate()", () => {
    const causationId = CausationId.generate()

    expect(causationId.raw).toBeDefined()
  })

  it("fromEventId()", () => {
    const causationId = CausationId.fromEventId(DomainEventId.of("domain-event-id"))

    expect(causationId.raw).toEqual("domain-event-id")
  })

})
