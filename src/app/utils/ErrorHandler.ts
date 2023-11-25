import { Response } from 'express';

interface ZodError {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  error?: ZodError[] | { code?: number; description?: string } | any[];
}

export function handleValidationError(
  res: Response,
  err: any,
  customMessage?: string,
): void {
  let response: ErrorResponse;

  if (err.errors && Array.isArray(err.errors)) {
    // Zod validation errors
    const zodErrors: ZodError[] = err.errors.map((error: any) => ({
      code: error.code,
      expected: error.expected,
      received: error.received,
      path: error.path,
      message: error.message,
    }));

    response = {
      success: false,
      message: customMessage || 'Validation error',
      error: zodErrors,
    };
  } else {
    response = {
      success: false,
      message: customMessage || err.message || 'Something went wrong',
      error: {
        code: (err.code || 500) as number,
        description: customMessage || err.message || 'Internal Server Error',
      },
    };
  }

  res
    .status(
      response.error && 'code' in response.error
        ? response.error.code || 500
        : 500,
    )
    .json(response);
}

interface DuplicateKeyError {
  code: number;
  keyPattern: Record<string, number | string>;
  keyValue: Record<string, number | string>;
}

interface CustomError {
  code?: number;
  description?: string;
  httpStatusCode?: number;
}

export function handleMongoDuplicateKeyError(
  res: Response,
  error: DuplicateKeyError,
  customError?: CustomError,
): void {
  const { code, keyPattern, keyValue } = error;
  const duplicateKey = Object.keys(keyPattern)[0];
  const duplicateValue = keyValue[duplicateKey];

  const response = {
    success: false,
    message: customError?.description || 'Duplicate key error',
    error: {
      code: customError?.code || 409,
      description: `Duplicate key error on field: ${duplicateKey} with value: ${duplicateValue}`,
      details: {
        code,
        keyPattern,
        keyValue,
      },
    },
  };

  res.status(customError?.httpStatusCode || response.error.code).json(response);
}

export function handleError(
  res: Response,
  error: any,
  customError?: CustomError,
): void {
  if (error.code === 11000 && error.keyPattern && error.keyValue) {
    handleMongoDuplicateKeyError(res, error, customError);
  } else {
    handleValidationError(res, error, customError?.description);
  }
}
