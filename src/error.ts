export class AppError extends Error {
    message: string;
    statusCode: number;
    translationKey: string | undefined;

    constructor(statusCode: number, message: string, translationKey?: string) {
      super(message);
      this.message = message;
      this.statusCode = statusCode;
      this.translationKey = translationKey;
    }

    toObject() {
      return {
        message: this.message,
        statusCode: this.statusCode,
        translationKey: this.translationKey,
      };
    }
}

export function ErrorRo(statusCode: number, message: string, translationKey?: string): AppError {
  return new AppError(statusCode, message, translationKey);
}
