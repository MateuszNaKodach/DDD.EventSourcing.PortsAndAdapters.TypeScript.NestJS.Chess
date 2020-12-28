import { Module } from '@nestjs/common';
import { ChessGameApplicationModule } from '../../application/chess-game-application.module';
import { ChessGameGrpcController } from './chess-game.grpc-controller';

@Module({
  imports: [
    ChessGameApplicationModule,
  ],
  controllers: [
    ChessGameGrpcController
  ]
})
export class ChessGameGrpcServiceModule {

}
