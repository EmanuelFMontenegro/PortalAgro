export function setupUnloadListener(): void {
  window.addEventListener('beforeunload', () => {
    localStorage.clear();
  });
}
