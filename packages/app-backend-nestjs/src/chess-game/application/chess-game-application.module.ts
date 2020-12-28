import {Module} from "@nestjs/common";
import {ChessGameInfrastructureModule} from "../infrastructure/chess-game-infrastructure.module";
import {StartChessGameCommandHandler} from "./start-chess-game.command-handler";
import {MoviePieceCommandHandler} from "./movie-piece.command-handler";
import { SharedKernelApplicationModule } from '../../shared-kernel/application/shared-kernel-application.module';

@Module({
  imports: [
    SharedKernelApplicationModule,
    ChessGameInfrastructureModule
  ],
  providers: [
    StartChessGameCommandHandler,
    MoviePieceCommandHandler
  ],
  exports: [SharedKernelApplicationModule],
})
export class ChessGameApplicationModule {
}
