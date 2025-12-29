declare interface Window {
  TAC: {
    reloadCaptcha: () => void
    destroyWindow: () => void
  }
  initTAC: <E, T, N>(e: E, t: T, n?: N) => Promise<{ init: () => void }>
}
