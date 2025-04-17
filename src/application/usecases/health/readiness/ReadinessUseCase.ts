import { TReadinessUseCaseInput, TReadinessUseCaseOutput } from "./TReadinessUseCase";
import { IReadinessUseCase } from "./IReadinessUseCase";
import { DataBaseConnector } from "@infra/persistence/DataBaseConnector";
import { InternalServerError } from "@infra/http/errors/http-errors/InternalServerError";

export class ReadinessUseCase implements IReadinessUseCase {
  async execute(_: TReadinessUseCaseInput): Promise<TReadinessUseCaseOutput> {
    const databaseIsConnected = DataBaseConnector.getInstance().isConnected()

    if (!databaseIsConnected) {
        throw new InternalServerError("Database is not connected")
    }

    return
  }
}