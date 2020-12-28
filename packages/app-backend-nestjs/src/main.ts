import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { chessGameGrpcMicroservice } from './chess-game/presentation/grpc/chess-game-grpc-nestjs-microservice';

const microservices = [
  chessGameGrpcMicroservice,
];

const connectMicroservicesTo = async (app: INestApplication) => {
  microservices.forEach(microservice => app.connectMicroservice(microservice));
  await app.startAllMicroservicesAsync();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connectMicroservicesTo(app);
  await app.listen(3000);
}

bootstrap();
