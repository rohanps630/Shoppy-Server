import { BadGatewayException, BadRequestException, HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DuplicateRecordException } from './exception';

export class HttpExceptionThrower {
  public static throw(error: any) {
    const httpError = error as IHttpError;

    if (!httpError || !httpError.response) {
      throw new InternalServerErrorException();
    }

    if (!httpError.response.data && !httpError.response.status) {
      throw new InternalServerErrorException();
    }

    if (httpError.response.data.statusCode) {
      throw new HttpException(HttpException.createBody(httpError.response.data as unknown as any), httpError.response.data.statusCode);
    }

    if (httpError.response.status) {
      throw new HttpException(httpError.response.statusText, httpError.response.status);
    }

    throw new InternalServerErrorException();
  }
}

export interface IHttpError {
  response: IHttpErrorResonse;
}

export interface IHttpErrorResonse {
  data: IHttpErrorData;
  status: number;
  statusText: string;
}

export interface IHttpErrorData {
  statusCode: number;
  message: string;
}

export function handleException(error: unknown): string {
  if (error instanceof Error) {
    console.error('An unexpected error occurred:', error);
    logErrorToTrackingSystem(error);
    throw error;
  }

  if (error instanceof BadRequestException) {
    console.error('Bad Request:', error.message);
    logErrorToTrackingSystem(error);
    throw error;
  }
  if (error instanceof BadGatewayException) {
    console.error('Bad Gateway:', error.message);
    logErrorToTrackingSystem(error);
    throw error;
  }
  if (error instanceof NotFoundException) {
    console.error('Not Found:', error.message);
    logErrorToTrackingSystem(error);
    throw error;
  }
  if (error instanceof DuplicateRecordException) {
    console.error('Duplicate Record:', error.message);
    logErrorToTrackingSystem(error);
    throw error;
  }

  // Default error message and handling
  console.error('An unknown error occurred:', error);
  logErrorToTrackingSystem(error);
  return 'An error occurred while processing the request.';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logErrorToTrackingSystem(error: unknown): void {
  // Implement your code to log errors to a centralized tracking system here.
  // Example: logErrorService.log(error);
}
