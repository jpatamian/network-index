export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options)
}
