export function isDefined<T>(x: T | undefined): x is T {
    return typeof x !== "undefined" && x !== null;
}

export function isNotDefined<T>(x: T | undefined): x is undefined {
    return !isDefined(x);
}
