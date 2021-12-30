export function saveToLocalStorage(key: string, val: string): void {
  return window.localStorage.setItem(key, val);
}

export function getFromLocalStorage(key: string): string | null {
  return window.localStorage.getItem(key);
}
