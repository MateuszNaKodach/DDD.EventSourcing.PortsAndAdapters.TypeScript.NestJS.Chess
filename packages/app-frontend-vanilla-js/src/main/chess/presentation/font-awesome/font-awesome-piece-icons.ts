import {Side} from "@ddd-es-ts-chess/chess-domain";
import { PieceName } from "@ddd-es-ts-chess/chess-domain";


export default class FontAwesomePieceIcons {

    static getBy(name: PieceName, side: Side): string {
        return `<i class="fas fa-chess-${name.toLowerCase()} ${side}"></i>`
    }

}
