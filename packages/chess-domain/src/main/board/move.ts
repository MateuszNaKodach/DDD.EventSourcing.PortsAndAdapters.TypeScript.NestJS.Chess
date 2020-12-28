import {Piece} from "../pieces/piece";
import { Square } from "./square";

export type PieceMoved = {
    piece: Piece;
    from: Square;
    to: Square;
    captured?: Piece | undefined
}

export type PieceNotMoved = PieceMoved & { reason: string }
