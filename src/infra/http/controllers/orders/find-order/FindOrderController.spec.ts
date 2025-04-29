import { IFindAllOrdersUseCase } from '@application/usecases/orders/find-order/find-all-orders/IFindAllOrdersUseCase';
import { IFindOneOrderUseCase } from '@application/usecases/orders/find-order/find-one-order/IFindOneOrderUseCase';
import { HttpResponseHandler } from '@infra/http/protocols/httpResponses';
import { HttpRequest } from '@infra/http/protocols/http';
import { makeOrder } from '@test/makeData/order.make';
import { FindAllOrOneOrdersController } from './FindOrderController';

// Mock do HttpResponseHandler
jest.mock('@infra/http/protocols/httpResponses', () => ({
  HttpResponseHandler: {
    ok: jest.fn(),
    notFound: jest.fn()
  }
}));

describe('FindAllOrOneOrdersController', () => {
  let controller: FindAllOrOneOrdersController;
  let findAllOrdersUseCase: jest.Mocked<IFindAllOrdersUseCase>;
  let findOneOrderUseCase: jest.Mocked<IFindOneOrderUseCase>;

  beforeEach(() => {
    findAllOrdersUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<IFindAllOrdersUseCase>;

    findOneOrderUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<IFindOneOrderUseCase>;

    controller = new FindAllOrOneOrdersController(
      findAllOrdersUseCase,
      findOneOrderUseCase
    );
  });

  it('when id is provided and order is found should return ok response with order', async () => {
    const fakeOrder = makeOrder();
    const request: HttpRequest = { query: { id: 1 } };

    findOneOrderUseCase.execute.mockResolvedValue(fakeOrder);
    (HttpResponseHandler.ok as jest.Mock).mockReturnValue({ statusCode: 200, body: fakeOrder });

    const response = await controller.handle(request);

    expect(findOneOrderUseCase.execute).toHaveBeenCalledWith({ id: 1 });
    expect(HttpResponseHandler.ok).toHaveBeenCalledWith(fakeOrder);
    expect(response).toEqual({ statusCode: 200, body: fakeOrder });
  });

  it('when id is provided and order is not found should return notFound response', async () => {
    const request: HttpRequest = { query: { id: 999 } };

    findOneOrderUseCase.execute.mockResolvedValue(null);
    (HttpResponseHandler.notFound as jest.Mock).mockReturnValue({ statusCode: 404, body: 'Order not found' });

    const response = await controller.handle(request);

    expect(findOneOrderUseCase.execute).toHaveBeenCalledWith({ id: 999 });
    expect(HttpResponseHandler.notFound).toHaveBeenCalledWith('Order not found');
    expect(response).toEqual({ statusCode: 404, body: 'Order not found' });
  });

  it('when id is not provided should return ok response with all orders', async () => {
    const fakeOrders = [makeOrder(), makeOrder()];
    const request: HttpRequest = { query: {} };

    findAllOrdersUseCase.execute.mockResolvedValue(fakeOrders);
    (HttpResponseHandler.ok as jest.Mock).mockReturnValue({ statusCode: 200, body: fakeOrders });

    const response = await controller.handle(request);

    expect(findAllOrdersUseCase.execute).toHaveBeenCalled();
    expect(HttpResponseHandler.ok).toHaveBeenCalledWith(fakeOrders);
    expect(response).toEqual({ statusCode: 200, body: fakeOrders });
  });
});
