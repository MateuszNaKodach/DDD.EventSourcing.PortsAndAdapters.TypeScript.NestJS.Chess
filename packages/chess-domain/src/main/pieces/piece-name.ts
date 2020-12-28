const pieces = ['King', 'Queen', 'Bishop', 'Knight', 'Rook', 'Pawn'] as const;
const promotionPieces = ['Queen', 'Bishop', 'Knight', 'Rook'] as const;

export type PieceName = typeof pieces[number];

export type PromotionPieceName = typeof promotionPieces[number];

export function isPromotionPieceName(name: string | undefined): name is PromotionPieceName {
    return name !== undefined && promotionPieces.map(it => it.toLowerCase()).includes(name.toLowerCase());
}

export function isPieceName(name: string | undefined): name is PieceName {
    return name !== undefined && pieces.map(it => it.toLowerCase()).includes(name.toLowerCase());
}
