export const toErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const getInitial = (value: string) => {
  return value.charAt(0).toUpperCase();
};
