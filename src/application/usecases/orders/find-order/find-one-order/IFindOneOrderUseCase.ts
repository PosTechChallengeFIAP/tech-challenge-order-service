import { IUseCase } from "@application/usecases/IUseCase";
import { TFindOneOrderUseCaseRequest, TFindOneOrderUseCaseResponse } from "./TFindOneOrderUseCase";

export interface IFindOneOrderUseCase extends IUseCase<TFindOneOrderUseCaseRequest, TFindOneOrderUseCaseResponse> {}