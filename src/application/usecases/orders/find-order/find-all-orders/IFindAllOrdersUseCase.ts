import { IUseCase } from "@application/usecases/IUseCase";
import { TFindAllOrdersUseCaseRequest, TFindAllOrdersUseCaseResponse } from "./TFindAllOrdersUseCase";

export interface IFindAllOrdersUseCase extends IUseCase<TFindAllOrdersUseCaseRequest, TFindAllOrdersUseCaseResponse> {}