/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transactions/transactionservice';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.entity';

describe('TransactionService - getGraphData', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should return correct graph data', async () => {
    // Mock data similar to what you expect to see in Postman
    const transactions = [
      { type: 'income', amount: 1000, date: '2024-01-10' },
      { type: 'income', amount: 200, date: '2024-02-15' },
      { type: 'income', amount: 1000, date: '2024-03-05' },
      { type: 'expense', amount: 200, date: '2024-04-10' },
      { type: 'income', amount: 500, date: '2024-05-20' },
      { type: 'income', amount: 150, date: '2024-07-25' },
    ] as unknown as Transaction[];

    // Mock repository method
    jest.spyOn(transactionRepository, 'find').mockResolvedValue(transactions);

    // Call the method under test
    const result = await service.getGraphData();

    // Expected result
    expect(result).toEqual({
      incomeData: [1000, 200, 1000, 0, 500, 0, 150, 0, 0, 0, 0, 0],
      expenseData: [0, 0, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0],
    });
  });

  it('should return empty graph data if no transactions found', async () => {
    // Mock empty data
    jest.spyOn(transactionRepository, 'find').mockResolvedValue([]);

    // Call the method under test
    const result = await service.getGraphData();

    // Expected result
    expect(result).toEqual({
      incomeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expenseData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
  });/*  */
});
