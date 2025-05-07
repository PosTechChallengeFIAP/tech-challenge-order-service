import { IUseCase } from "@application/usecases/IUseCase";
import { TCreateOrderUseCaseRequest, TCreateOrderUseCaseResponse } from "./TCreateOrderUseCase";

export interface ICreateOrderUseCase extends IUseCase<TCreateOrderUseCaseRequest, TCreateOrderUseCaseResponse> {}