import * as functions from 'firebase-functions';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module'; // Import your NestJS app module

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Optional: Enable CORS if your API needs it
  await app.init();
  
  const server = express();
  server.use('/', app.getHttpAdapter().getInstance()); // Hook NestJS with Express

  return server;
}

export const api = functions.https.onRequest(async (req, res) => {
  const server = await bootstrap();
  server(req, res);
});
