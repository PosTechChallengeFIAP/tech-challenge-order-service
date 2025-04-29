
import { IFindAllOrdersUseCase } from '@application/usecases/orders/find-order/find-all-orders/IFindAllOrdersUseCase';
import { EHttpStatusCode } from '@infra/http/protocols/EHttpStatusCode';
import { HttpRequest } from '@infra/http/protocols/http';
import { makeOrder } from '@test/makeData/order.make';
import { IOrder } from '@application/DTOs/order.interface';
import { FindAllOrOneOrdersController } from './FindOrderController';

describe('FindAllOrOneOrdersController', () => {
  let mockUseCase: jest.Mocked<IFindAllOrdersUseCase>;
  let controller: FindAllOrOneOrdersController;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    };

    controller = new FindAllOrOneOrdersController(mockUseCase);
  });

  it('when handle is called should return orders in http response', async () => {
    const fakeOrders: IOrder[] = [
        makeOrder(),
        makeOrder(),
    ];

    mockUseCase.execute.mockResolvedValue(fakeOrders);

    const httpRequest: HttpRequest = {};
    const response = await controller.handle(httpRequest);

    expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      body: fakeOrders,
      statusCode: EHttpStatusCode.OK,
      type: 'json'
    });
  });
});
