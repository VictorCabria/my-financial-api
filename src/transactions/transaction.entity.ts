/* eslint-disable prettier/prettier */
// transaction.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column()
  description: string;

  @Column()
  type: 'income' | 'expense';

  @Column()
  date: string;
}
