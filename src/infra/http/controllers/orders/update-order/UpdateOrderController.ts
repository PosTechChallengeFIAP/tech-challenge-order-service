import { UpdateOrderStatusUseCase } from "@application/usecases/orders/update-order-status/UpdateOrderStatus";
import { IController } from "@infra/http/protocols/controller";
import { HttpRequest, HttpResponse } from "@infra/http/protocols/http";
import { HttpResponseHandler } from "@infra/http/protocols/httpResponses";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateOrderController implements IController{
    constructor(
        @inject("UpdateOrderStatusUseCase")
        private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    ) {}
    
    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { orderId } = request.params;
        const { status } = request.body;
    
        const updatedOrder = await this.updateOrderStatusUseCase.execute({ orderId, status });
    
        return HttpResponseHandler.ok(updatedOrder);
    }
}