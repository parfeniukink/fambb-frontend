// Just create a today ``Date`` object
export function today() {
  return new Date().toISOString().slice(0, 10)
}
