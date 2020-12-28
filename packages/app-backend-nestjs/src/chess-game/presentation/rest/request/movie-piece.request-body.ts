import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsNotEmpty} from "class-validator";

export class MoviePieceRequestBody {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  readonly fromSquare: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  readonly toSquare: string;


  constructor(fromSquare: string, toSquare: string) {
    this.fromSquare = fromSquare;
    this.toSquare = toSquare;
  }
}
