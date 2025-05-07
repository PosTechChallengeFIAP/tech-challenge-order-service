import { ICreateOrderUseCase } from "@application/usecases/orders/create-order/ICreateOrderUseCase";
import { HttpRequest, HttpResponse } from "@infra/http/protocols/http";
import { HttpResponseHandler } from "@infra/http/protocols/httpResponses";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateOrderController {
    constructor(
        @inject("CreateOrderUseCase")
        private readonly createOrderUseCase: ICreateOrderUseCase,
    ) {}
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { body } = request;
        const result = await this.createOrderUseCase.execute(body);
        return HttpResponseHandler.created(result);
    }
}