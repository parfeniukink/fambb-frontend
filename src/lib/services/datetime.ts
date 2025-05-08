export function formatDate(
  dateStr: string,
  includeYear: boolean = false
): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: includeYear ? "numeric" : undefined,
    month: "short",
    day: "numeric",
  })
}
