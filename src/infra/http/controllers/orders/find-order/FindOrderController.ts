import { IFindAllOrdersUseCase } from "@application/usecases/orders/find-order/find-all-orders/IFindAllOrdersUseCase";
import { IController } from "@infra/http/protocols/controller";
import { HttpRequest, HttpResponse } from "@infra/http/protocols/http";
import { HttpResponseHandler } from "@infra/http/protocols/httpResponses";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllOrOneOrdersController implements IController {
    constructor(
        @inject("FindAllOrdersUseCase")
        private readonly findAllOrdersUseCase: IFindAllOrdersUseCase
    ) {}

    async handle(_: HttpRequest): Promise<HttpResponse> {
        const result = await this.findAllOrdersUseCase.execute();
        return HttpResponseHandler.ok(result);
    }
}