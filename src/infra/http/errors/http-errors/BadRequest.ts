import { EHttpStatusCode } from "@infra/http/protocols/EHttpStatusCode";
import { HttpError } from "./HttpError";

export class BadRequest extends HttpError {
  constructor(message: string, additionalInfo?: any) {
    super(EHttpStatusCode.BAD_REQUEST, message, additionalInfo);
  }
}