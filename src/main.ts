import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for all origins (you can customize this for production)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'UserId'],
    credentials: true,
  });
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
