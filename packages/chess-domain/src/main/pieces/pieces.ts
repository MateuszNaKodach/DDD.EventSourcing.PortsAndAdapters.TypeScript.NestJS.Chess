import {King} from "./king";
import {Queen} from "./queen";
import {Bishop} from "./bishop";
import {Knight} from "./knight";
import {Rook} from "./rook";
import {Pawn} from "./pawn";
import {Side} from "./side";
import { PieceName } from "./piece-name";
import {Piece} from "./piece";

const nameToPiece: { [key in PieceName]: (side: Side) => Piece } = {
  King: (side: Side) => new King(side),
  Queen: (side: Side) => new Queen(side),
  Bishop: (side: Side) => new Bishop(side),
  Knight: (side: Side) => new Knight(side),
  Rook: (side: Side) => new Rook(side),
  Pawn: (side: Side) => new Pawn(side)
};

export class Pieces {
    
  static getBy(name: PieceName, side: Side): Piece {
    return nameToPiece[name](side)
  }

}
