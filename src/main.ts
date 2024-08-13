/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: '*', // Permitir solicitudes desde cualquier origen. Puedes especificar un dominio en lugar de '*'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Financial Transactions API')
    .setDescription('API para gestionar transacciones financieras')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Escuchar en el puerto 3000
  await app.listen(3000);
}
bootstrap();
