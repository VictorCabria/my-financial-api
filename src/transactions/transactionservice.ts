/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  // Obtener todas las transacciones con filtros opcionales
  findAll(filters?: Partial<Transaction>): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: filters });
  }

  // Obtener una transacción específica por ID
  findOne(id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  // Obtener resumen de saldo, ingresos y gastos
  async getSummary(): Promise<{
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
  }> {
    try {
      const transactions = await this.transactionRepository.find();
      console.log('Transacciones recuperadas:', transactions);

      if (transactions.length === 0) {
        console.log('No se encontraron transacciones');
        return {
          totalBalance: 0,
          totalIncome: 0,
          totalExpense: 0,
        };
      }

      const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0); // Asegúrate de que `amount` sea un número
      const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const totalBalance = totalIncome - totalExpense;

      console.log('Resumen calculado:', {
        totalBalance: totalBalance.toFixed(2), // Ajusta los decimales si es necesario
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
      });

      return {
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpense: parseFloat(totalExpense.toFixed(2)),
      };
    } catch (error) {
      console.error('Error en getSummary:', error);
      throw error;
    }
  }

  // Obtener datos para graficar la evolución de ingresos y gastos mensuales
  async getGraphData(): Promise<{
    incomeData: number[];
    expenseData: number[];
  }> {
    const transactions = await this.transactionRepository.find();
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);

    transactions.forEach((t) => {
      const month = new Date(t.date).getMonth();
      const amount = parseFloat(t.amount.toString());

      if (t.type === 'income') {
        incomeData[month] += amount;
      } else if (t.type === 'expense') {
        expenseData[month] += amount;
      }
    });

    const formattedIncomeData = incomeData.map((value) =>
      parseFloat(value.toFixed(2)),
    );
    const formattedExpenseData = expenseData.map((value) =>
      parseFloat(value.toFixed(2)),
    );

    // Log de los datos finales que se devolverán
    console.log('Income Data:', formattedIncomeData);
    console.log('Expense Data:', formattedExpenseData);

    return {
      incomeData: formattedIncomeData,
      expenseData: formattedExpenseData,
    };
  }
}
