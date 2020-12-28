import {Module} from "@nestjs/common";
import {ChessGameRestController} from "./chess-game.rest-controller";
import {ChessGameInfrastructureModule} from "../../infrastructure/chess-game-infrastructure.module";
import { ChessGameApplicationModule } from '../../application/chess-game-application.module';

@Module({
  imports: [
    ChessGameInfrastructureModule,
    ChessGameApplicationModule
  ],
  controllers: [ChessGameRestController]
})
export class ChessGameRestApiModule {

}
