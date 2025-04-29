import { IFindAllOrdersUseCase } from "@application/usecases/orders/find-order/find-all-orders/IFindAllOrdersUseCase";
import { IFindOneOrderUseCase } from "@application/usecases/orders/find-order/find-one-order/IFindOneOrderUseCase";
import { IController } from "@infra/http/protocols/controller";
import { HttpRequest, HttpResponse } from "@infra/http/protocols/http";
import { HttpResponseHandler } from "@infra/http/protocols/httpResponses";
import { inject, injectable } from "tsyringe";

@injectable()
export class FindAllOrOneOrdersController implements IController {
    constructor(
        @inject("FindAllOrdersUseCase")
        private readonly findAllOrdersUseCase: IFindAllOrdersUseCase,
        @inject("FindOneOrderUseCase")
        private readonly findOneOrderUseCase: IFindOneOrderUseCase,
    ) {}

    async handle(HttpRequest: HttpRequest): Promise<HttpResponse> {
        const { query } = HttpRequest;
        const { id } = query;
        if (id) {
            const result = await this.findOneOrderUseCase.execute({ id });
            if (!result) {
                return HttpResponseHandler.notFound("Order not found");
            }
            return HttpResponseHandler.ok(result);
        }

        const result = await this.findAllOrdersUseCase.execute();
        return HttpResponseHandler.ok(result);
    }
}