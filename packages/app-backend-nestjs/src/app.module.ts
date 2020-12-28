import {Module} from '@nestjs/common';
import {ChessGameModule} from "./chess-game/chess-game.module";

@Module({
  imports: [ChessGameModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
