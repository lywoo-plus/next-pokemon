type AnySafeActionResult<TData> =
  | {
      data: TData;
      serverError?: undefined;
      validationErrors?: undefined;
    }
  | {
      data?: undefined;
      serverError: string;
      validationErrors?: undefined;
    }
  | {
      data?: undefined;
      serverError?: undefined;
      validationErrors: unknown;
    }
  | {
      data?: undefined;
      serverError?: undefined;
      validationErrors?: undefined;
    };

export async function runSafeAction<TData, TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<AnySafeActionResult<TData>>,
  ...args: TArgs
): Promise<Exclude<TData, undefined>> {
  const result = await action(...args);

  if (result.serverError) {
    throw new Error(result.serverError);
  }

  if (result.validationErrors) {
    throw new Error('Invalid input');
  }

  if ('data' in result) {
    return result.data as Exclude<TData, undefined>;
  }

  throw new Error('Action did not return data');
}
