import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const chessGameGrpcMicroservice: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'chessgame',
    protoPath: join(__dirname, './chess-game.proto'),
  },
};
