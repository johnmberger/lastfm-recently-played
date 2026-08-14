function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function errorStack(error: unknown): string | undefined {
  if (error instanceof Error) return error.stack;
  return undefined;
}

export function logApiError(route: string, error: unknown): void {
  console.error(`${route} error`, {
    message: errorMessage(error),
    stack: errorStack(error),
  });
}
