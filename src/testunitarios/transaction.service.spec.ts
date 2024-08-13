/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transactions/transactionservice';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Repository } from 'typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;

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
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should return summary', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([
      { amount: 1000, type: 'income' },
      { amount: 200, type: 'income' },
      { amount: 150, type: 'expense' },
      { amount: 50, type: 'expense' },
    ] as any);

    const result = await service.getSummary();
    expect(result).toEqual({
      totalBalance: 1000,
      totalIncome: 1200,
      totalExpense: 200,
    });
  });
});
