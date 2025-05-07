import { CreateOrderController } from "@infra/http/controllers/orders/create-order/CreateOrderController";
import { ICreateOrderUseCase } from "@application/usecases/orders/create-order/ICreateOrderUseCase";
import { HttpResponseHandler } from "@infra/http/protocols/httpResponses";
import { EHttpStatusCode } from "@infra/http/protocols/EHttpStatusCode";

jest.mock("@infra/http/protocols/httpResponses");

describe('CreateOrderController', () => {
  const mockUseCase: ICreateOrderUseCase = {
    execute: jest.fn(),
  };

  const mockRequest = {
    body: {
      pdvId: 1,
      pdvName: "PDV Teste",
      clientId: 99,
      items: [{ productId: 1, quantity: 2 }],
    }
  };

  const mockResponse = { id: 123, ...mockRequest.body };

  let controller: CreateOrderController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CreateOrderController(mockUseCase);
  });

  it('when handle is called with valid request should call useCase and return created response', async () => {
    (mockUseCase.execute as jest.Mock).mockResolvedValue(mockResponse);
    const mockedCreated = jest.spyOn(HttpResponseHandler, 'created').mockReturnValue({ statusCode: EHttpStatusCode.CREATED, body: mockResponse });

    const response = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
    expect(mockedCreated).toHaveBeenCalledWith(mockResponse);
    expect(response).toBeDefined();
  });

  it('when useCase throws an error should propagate the error', async () => {
    const error = new Error("Internal error");
    (mockUseCase.execute as jest.Mock).mockRejectedValue(error);

    await expect(controller.handle(mockRequest)).rejects.toThrow("Internal error");
  });
});
