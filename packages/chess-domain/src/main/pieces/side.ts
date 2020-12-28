export enum Side {
  WHITE = "white",
  BLACK = "black"
}

export namespace Side {
  export function values(): Side[] {
    return [Side.WHITE, Side.BLACK];
  }

  export function findByString(s: string): Side | undefined {
    const lowerCased = s.toLowerCase();
    return values().find((value: Side) => lowerCased === value.toLowerCase() || value[0] === lowerCased.toLowerCase()[0]);
  }

  export function byName(name: "black" | "white"): Side {
    return findByString(name)!;
  }

  export function another(side: Side): Side {
    return side === Side.WHITE ? Side.BLACK : Side.WHITE;
  }

}
