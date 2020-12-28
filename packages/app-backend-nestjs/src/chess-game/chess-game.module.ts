import {Module} from "@nestjs/common";
import {ChessGameInfrastructureModule} from "./infrastructure/chess-game-infrastructure.module";
import {ChessGamePresentationModule} from "./presentation/chess-game-presentation.module";
import {ChessGameApplicationModule} from "./application/chess-game-application.module";

//TODO: How to add query! New module - ChessGamePieces?
@Module({
  imports: [
    ChessGamePresentationModule,
    ChessGameApplicationModule,
    ChessGameInfrastructureModule,
  ]
})
export class ChessGameModule {
}
