import {Side} from "../../main/pieces/side";

describe('Piece side', () => {


    describe("White", () => {

        it('should be able to found by "W" string', () => {
            expect(Side.findByString('W')).toBe(Side.WHITE);
        })

        it('another side should be Black', () => {
            expect(Side.another(Side.WHITE)).toBe(Side.BLACK)
        })

    })

    describe("Black", () => {

        it('should be able to found by "B" string', () => {
            expect(Side.findByString('B')).toBe(Side.BLACK);
        })

        it('another side should be White', () => {
            expect(Side.another(Side.BLACK)).toBe(Side.WHITE)
        })

    })


});
