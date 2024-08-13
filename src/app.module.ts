/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'financial_db',
      entities: [Transaction],
      synchronize: true, // Usar solo en desarrollo
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
