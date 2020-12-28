# TypeScript & NestJS & React | Modular Monolith with DDD & Event Sourcing & Ports and Adapters (Hexagonal) Architecture

If you want to see how to implement fully-encapsulated, idempotent from technical concerns, domain model you're in the right place. 
Whenever you have an idea how to make this repository more valuable fell free to create pull requests.
If something is not understandable for you, or some solutions looks like not going with the state of the art im open to discuss to also develop myself.


**Disclaimer**

My native language is Kotlin / Java, so if you have any ideas how to polish my TypeScript skills, you're very welcome.

### Kotlin / JVM example
Wanna see sibling repository with more functional-like style?
Let's look at... I'm currently working on it. Coming soon... stay tuned and follow me on [Twitter @MateuszNaKodach](https://twitter.com/MateuszNaKodach).

## Introduction

### Purpose of this repository

In the JavaScript world there is lack of many examples of good architecture with strong separation of concerns.
This probably comes from that JS is not strong-typed language. So it's very difficult to create explicit contracts between classes / apis / modules in the code. 
To do that we use benefits with have been brought to us with TypeScript.
In this repository you will see what is screaming architecture in practice.

 
### Repository structure
This repository base on lerna monorepo.
There are few projects (you can read about their details in the next section), which are:
- **chess-domain (COMPLETED)** - fully implemented chess engine.
- **chess-piece-emoji (COMPLETED)** - library which can be used to describe chess by mean of emojis
- **ddd-building-blocks (COMPLETED)** - implementation of Tactical Domain-Driven Design building blocks like: Aggregate, DomainEvent etc.
- **app-frontend-vanilla-js (COMPLETED)** - application in vanilla-js. It uses chess-domain and shows how encapsulated domain model can be used to make browser game.
- **app-backend-nestjs (WORK IN PROGRESS)** - application use NestJS framework. It uses chess-domain and shows how same encapsulated domain model can be used to make backend for multiplayer chess platform.

Those projects should have shown that following DDD practices should result in domain model which is free from infrastructure concerns and if domain doesn't change it also keeps unchanged.
Doesn't matter if you are doing scalable, huge backend solution or simple browser single-player app (but of course - as always, there also can be some special cases and exceptions).


### Modules

#### MODULE I. chess-domain

Depends on: ddd-building-blocks-domain

##### Events which tell you a story

Architecture of this module is screaming. 
It's self described and tell you a lot what is possible in this domain.
You can learn a lot just by looking at file names.
Look at events (named according to [THIS](https://verraes.net/2019/06/messaging-patterns-natural-language-message-names/)) which took place in this domain.
```
└── event
    ├── checkmate-has-occurred.ts
    ├── chess-game-abstract-domain-event.ts
    ├── chess-game-finished.ts
    ├── chess-game-not-started.ts
    ├── chess-game-started.ts
    ├── chess-game-was-lost.ts
    ├── chess-game-was-won.ts
    ├── index.ts
    ├── king-was-checked.ts
    ├── king-was-unchecked.ts
    ├── pawn-promotion-was-enabled.ts
    ├── pawn-was-not-promoted.ts
    ├── pawn-was-promoted.ts
    ├── piece-was-captured.ts
    ├── piece-was-moved.ts
    ├── piece-was-not-moved.ts
    └── stalemate-has-occurred.ts
```
Have you remembered that in chess there is something like stalemate?
You can refresh your knowledge about the domain from this software.
This is a sign, that Ubiquitous Language of chess, is reflected properly in this code.

Domain is modeled using domain events, but it's totally orthogonal from Event Sourcing.
You can express your domain in events and DO NOT use Event Sourcing at all.
It's just persistence concerns which I will show you in the future in the NestJS application module.

##### Simple domain modeling
Every action in the domain can be described as a function like this:
```
(state, command) -> events
```
You execute command on a given state, which produce an event or many events as a result.
In this implementation I split events in two categories: success events and failure events.
Many DDD practitioners throws exception if command try to break some invariants or domain rules.
But IMO exceptions are similar mistakes to NULL in programming, so I'm trying to avoid them as much as I can.

Below there is definition of one domain action (command). Command name is method name `movePiece`.
Arguments are passed in one object named `command`. 
Current state is provided by a class, because it's a method of ChessGame class.
Result of command is Success or Failure, which is wrapper for certain events.
```ts
movePiece = (command: { by: PlayerId, from: Square, to: Square }): Success<PieceMoveEffect> | Failure<PieceNotMovedEvent>
```
Failure events may be useful in some cases, when you want to react on them.
For example -> three events like LoginAttemptWasFailed may result in blocking user account for a while.
In DDD community is also popular throwing exceptions on failure, but I'm against of exceptions at all.

##### Emoji-Driven Test Development
Have you ever wondered how to write readable tests for chess engine? 
If you understand Polish Language I'm blogging a lot about this on my [Blog](https://zycienakodach.pl).
But if not... I hope this code will explain you this concept better than 1000 words.
There are same test cases implemented in this repository:

```ts
    EmojiChessBoardTestCase.givenChessBoard({
      8: [' ', ' ', ' ', '♚', ' ', ' ', ' ', ' '],
      7: [' ', ' ', ' ', '♙', ' ', ' ', ' ', ' '],
      6: [' ', ' ', ' ', '♔', ' ', ' ', ' ', ' '],
      5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }).testStalemate(Side.BLACK)
```

```ts
  EmojiChessBoardTestCase.givenChessBoard({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '♟', ' ', '♟', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♗', ' ', ' ', ' ', ' '],
    3: [' ', ' ', '♟', ' ', '♟', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).thenExpectMoves({
    8: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    7: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    5: [' ', ' ', '🗡️', ' ', '🗡️', ' ', ' ', ' '],
    4: [' ', ' ', ' ', '♗', ' ', ' ', ' ', ' '],
    3: [' ', ' ', '🗡️', ' ', '🗡️', ' ', ' ', ' '],
    2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    1: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }).asTest("should not skip enemy chess and attack on diagonals")
```

```ts
  EmojiChessBoardTestCase.givenChessBoard({
    8: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    7: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    6: [" ", " ", " ", " ", " ", " ", " ", " "],
    5: [" ", " ", " ", " ", " ", " ", " ", " "],
    4: [" ", " ", " ", " ", " ", " ", " ", " "],
    3: [" ", " ", " ", " ", " ", " ", " ", " "],
    2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
    0: ["A", "B", "C", "D", "E", "F", "G", "H"]
  })
    .whenPick({ piece: "♘", on: "B1" })
    .thenNormalMoves(["A3", "C3"])
    .thenAttackMoveIsNotAvailable()
```

##### Generic Given-When-Then testing approach

This emoji-driven testing is awesome in this domain. But if you are looking for more generic solution you can test the game like DDD Aggregates using Given-When-Then convention.

- Given: State of the aggregate (or past events)
- When: Command to execute against aggregate
- Then: Events produced by aggregate (or exception, but I prefer events which mean failures)
```ts
  it("when make move after which attack on king is impossible then king should be unchecked", () => {
    given({
      board: {
        8: [" ", "♞", "♝", "♛", " ", "♝", "♞", "♜"],
        7: [" ", "♟", " ", "♟", "♟", "♟", "♟", "♟"],
        6: [" ", " ", " ", " ", " ", " ", " ", " "],
        5: [" ", " ", "♜", " ", " ", " ", " ", " "],
        4: [" ", " ", " ", "♚", " ", " ", " ", " "],
        3: [" ", " ", "♟", " ", " ", " ", " ", " "],
        2: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        1: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
        0: ["A", "B", "C", "D", "E", "F", "G", "H"]
      }
    }).whenCommand(
      game => {
        game.movePiece({ by: whitePlayer, from: Square.fromAlgebraicNotation("B2"), to: Square.fromAlgebraicNotation("C3") });
        return game.movePiece({ by: blackPlayer, from: Square.fromAlgebraicNotation("C5"), to: Square.fromAlgebraicNotation("C3") });
      }
    ).thenEvent({
      type: KingWasUnchecked,
      data: {
        onSquare: Square.fromAlgebraicNotation("D4"),
        king: new King(Side.BLACK),
        afterMove: {
          piece: new Rook(Side.BLACK),
          from: Square.fromAlgebraicNotation("C5"),
          to: Square.fromAlgebraicNotation("C3"),
          captured: new Pawn(Side.WHITE)
        }
      }
    });
  });
```

#### MODULE II. chess-piece-emoji

Depends on: None.

This is presentation layer modules which also very helpful in developing Domain-Specific Language for describing and executing test cases.

```ts
export const EMOJIS_START_CONFIG: EmojiConfiguration = {
  8: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  7: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  6: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  5: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  4: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  3: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  2: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  1: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  0: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
}
```


#### MODULE III. ddd-building-blocks-domain

Depends on: None.

There are generic building blocks for Tactical Domain-Driven Design which may be useful in every application following those patterns.
Will be extended in the future.


#### MODULE IV. app-frontend-vanilla-js

Application developed using Model-View-Presenter architecture.
It shows how to use infrastructure agnostic domain model in simple web browser application.
Domain Events are hooks to show action results on user interface.


#### MODULE V. app-backend-nestjs

I'm currently working on it.
This will show you how to use the same domain-model to develop multi-player chess game solution.
Persistence layer will be implemented with Event Sourcing in mind.


### How to run it

#### Vanilla JS | Web browser application
1. Execute `yarn install`
1. Execute `yarn start:frontend:vanillajs` - working chess game will be available on `localhost:1234`

#### NestJS & React | Multiplayer client-server web application
Coming soon...

### Flaws of the code
Things which I may do better with my current knowledge.

1. *chess-domain* module depends on self-developed ddd-building-blocks-domain framework, which is very helpful. 
But it would be nice to use composition over inheritance and make domain model fully independent.

2. Refactor DSL for testing chess engine.

## Learning by doing
I was wondering about during implementation.

1. ChessGame is currently aggregate with a state. But it's possible to get rid of the state.
Then... what Aggregate? What is it? Is it part of infrastructure instead of the domain...?

2. ChessGame may not have knowledge about certain players. There sides are important.
