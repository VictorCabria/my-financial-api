/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionService } from './transactionservice';
import { Transaction } from './transaction.entity';
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // GET /transactions - Obtener todas las transacciones con filtros opcionales
  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Transaction[]> {
    const filters = {};
    if (type) filters['type'] = type;
    if (startDate) filters['date'] = MoreThanOrEqual(new Date(startDate));
    if (endDate) filters['date'] = LessThanOrEqual(new Date(endDate));

    return this.transactionService.findAll(filters);
  }

  // GET /transactions/:id - Obtener una transacción específica por ID
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  // GET /summary - Obtener un resumen con saldo, ingresos y gastos totales

  @Get('prueba/summary')
  async getSummary() {
    try {
      const summary = await this.transactionService.getSummary();
      console.log('Resumen enviado:', summary);
      return summary;
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      throw error;
    }
  }

  // GET /graph-data - Obtener datos para graficar la evolución de ingresos y gastos mensuales
  @Get('prueba/graphdata')
  async getGraphData(): Promise<{
    incomeData: number[];
    expenseData: number[];
  }> {
    return this.transactionService.getGraphData();
  }
}
