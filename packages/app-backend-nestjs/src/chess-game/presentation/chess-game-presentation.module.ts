import {Module} from "@nestjs/common";
import {ChessGameRestApiModule} from "./rest/chess-game-rest-api.module";
import { ChessGameGrpcServiceModule } from './grpc/chess-game-grpc-service.module';

@Module({
  imports: [
    ChessGameRestApiModule,
    ChessGameGrpcServiceModule
  ]
})
export class ChessGamePresentationModule {
}
