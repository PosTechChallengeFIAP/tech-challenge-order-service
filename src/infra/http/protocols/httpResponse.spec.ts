
import { EHttpStatusCode } from './EHttpStatusCode';
import { HttpResponseHandler } from './httpResponses';

describe('HTTP Response Helpers', () => {
  describe('ok()', () => {
    it('should return a 200 response with data and default type json', () => {
      const data = { message: 'Success' };
      const response = HttpResponseHandler.ok(data);

      expect(response).toEqual({
        body: data,
        statusCode: EHttpStatusCode.OK,
        type: 'json'
      });
    });

    it('should return a 200 response with data and type message', () => {
      const data = 'All right!';
      const response = HttpResponseHandler.ok(data, 'message');

      expect(response).toEqual({
        body: data,
        statusCode: EHttpStatusCode.OK,
        type: 'message'
      });
    });
  });

  describe('okNoData()', () => {
    it('should return a 200 response with "OK" and type message', () => {
      const response = HttpResponseHandler.okNoData();

      expect(response).toEqual({
        body: 'OK',
        statusCode: EHttpStatusCode.OK,
        type: 'message'
      });
    });
  });

  describe('created()', () => {
    it('should return a 201 response with data', () => {
      const data = { id: 1, name: 'Created resource' };
      const response = HttpResponseHandler.created(data);

      expect(response).toEqual({
        body: data,
        statusCode: EHttpStatusCode.CREATED
      });
    });
  });
});
