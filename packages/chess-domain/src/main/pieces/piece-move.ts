import { Square } from "../board";

export class PieceMove {

    readonly type: MoveType;
    readonly square: Square;

    private constructor(type: MoveType, square: Square) {
        this.type = type;
        this.square = square;
    }

    static attackAt(square: Square): PieceMove {
        return new PieceMove(MoveType.ATTACK, square);
    }

    static normalAt(square: Square): PieceMove {
        return new PieceMove(MoveType.NORMAL, square);
    }
}

export enum MoveType {
    NORMAL = "normal",
    ATTACK = "attack"
}
