export function isTouchDevice() {
  // expect msMaxTouchPoints sometimes to be in the document
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
