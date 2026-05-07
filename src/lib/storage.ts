export function readStoredValue<T>(key: string, fallback: T, parse: (value: string) => T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : parse(value);
  } catch {
    return fallback;
  }
}

export function writeStoredValue<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing or locked-down contexts; in-memory state still works.
  }
}
