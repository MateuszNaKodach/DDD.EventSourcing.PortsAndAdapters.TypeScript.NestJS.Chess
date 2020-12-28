import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovePieceRequestParams {
  @ApiProperty()
  @IsUUID()
  @IsDefined()
  @IsNotEmpty()
  readonly chessGameId: string;

  constructor(chessGameId: string) {
    this.chessGameId = chessGameId;
  }
}
