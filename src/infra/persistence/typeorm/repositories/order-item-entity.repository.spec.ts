import { OrderItemEntityRepository } from '@infra/persistence/typeorm/repositories/order-item-entity.repository';
import { typeOrmConnection } from '@infra/persistence/typeorm/typeorm-connection';
import { Repository } from 'typeorm';
import { OrderItemEntity } from '@infra/persistence/typeorm/models/order-item.entity';

jest.mock('@infra/persistence/typeorm/typeorm-connection', () => ({
  typeOrmConnection: {
    getRepository: jest.fn()
  }
}));

describe('OrderItemEntityRepository', () => {
  let repository: OrderItemEntityRepository;
  let mockRepo: jest.Mocked<Repository<OrderItemEntity>>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn()
    } as unknown as jest.Mocked<Repository<OrderItemEntity>>;

    (typeOrmConnection.getRepository as jest.Mock).mockReturnValue(mockRepo);
    repository = new OrderItemEntityRepository();
  });

  describe('save', () => {
    it('when saving a valid item should persist and return it', async () => {
      const itemToSave: any = {
        productId: 1,
        productName: 'Coca-Cola',
        productPrice: 5,
        quantity: 2,
        totalPrice: 10,
        orderId: 101
      };

      const savedItem = { id: 1, ...itemToSave };

      mockRepo.save.mockResolvedValue(savedItem);

      const result = await repository.save(itemToSave);

      expect(mockRepo.save).toHaveBeenCalledWith(itemToSave);
      expect(result).toEqual(savedItem);
    });

    it('when repository save throws should propagate the error', async () => {
      const itemToSave: any = {
        productId: 99,
        productName: 'Invalid',
        productPrice: 0,
        quantity: 0,
        totalPrice: 0,
        orderId: 1
      };

      const error = new Error('DB error');
      mockRepo.save.mockRejectedValue(error);

      await expect(repository.save(itemToSave)).rejects.toThrow('DB error');
      expect(mockRepo.save).toHaveBeenCalledWith(itemToSave);
    });
  });

  describe('saveAll', () => {
    it('when saving multiple valid items should return them all', async () => {
      const itemsToSave: any[] = [
        {
          productId: 1,
          productName: 'Pizza',
          productPrice: 20,
          quantity: 1,
          totalPrice: 20,
          orderId: 200
        },
        {
          productId: 2,
          productName: 'Juice',
          productPrice: 10,
          quantity: 2,
          totalPrice: 20,
          orderId: 200
        }
      ];

      const savedItems: any[] = [
        { id: 1, ...itemsToSave[0] },
        { id: 2, ...itemsToSave[1] }
      ];

      mockRepo.save.mockImplementation(async (item) =>
        savedItems.find((s: any) => s.productId === item.productId)
      );

      const result = await repository.saveAll(itemsToSave);

      expect(mockRepo.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(savedItems);
    });

    it('when one item fails to save should propagate the error and not return partial results', async () => {
      const itemsToSave: any[] = [
        {
          productId: 1,
          productName: 'Item 1',
          productPrice: 10,
          quantity: 1,
          totalPrice: 10,
          orderId: 300
        },
        {
          productId: 2,
          productName: 'Item 2',
          productPrice: 10,
          quantity: 1,
          totalPrice: 10,
          orderId: 300
        }
      ];

      mockRepo.save.mockImplementation(async (item: any) => {
        if (item.productId === 2) {
          throw new Error('Item 2 failed');
        }
        return { id: 1, ...item };
      });

      await expect(repository.saveAll(itemsToSave)).rejects.toThrow('Item 2 failed');
      expect(mockRepo.save).toHaveBeenCalledTimes(2);
    });
  });
});
