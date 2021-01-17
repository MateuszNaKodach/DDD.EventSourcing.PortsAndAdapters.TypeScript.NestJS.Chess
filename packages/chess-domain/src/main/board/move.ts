import {Piece} from "../pieces/piece";
import { Square } from "./square";

export type PieceMoved = {
    piece: Piece;
    from: Square;
    to: Square;
    captured?: Piece | undefined //FIXME: Captured is stale now!? Need to have onSquare!?!?! Because of enpassant
}

export type PieceNotMoved = PieceMoved & { reason: string }
