export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
    ...options,
  };
  return date.toLocaleDateString("en-US", defaultOptions);
}
