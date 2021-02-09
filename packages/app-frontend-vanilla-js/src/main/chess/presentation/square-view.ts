import {columnNumberToCharacter} from "@ddd-es-ts-chess/chess-domain";
import FontAwesomePieceIcons from "./font-awesome/font-awesome-piece-icons";
import {Column, Piece, PieceName, Pieces, Row, Side, Square} from "@ddd-es-ts-chess/chess-domain";

export class SquareView {
  readonly square: Square;
  private readonly piece: Piece | undefined;
  private readonly isChecked: boolean = false;
  private readonly isSelected: boolean = false;

  constructor(coord: { row: Square.Number, column: Square.Number } | Square, pieceProvider: (square: Square) => Piece | undefined, checked = false, selected = false) {
    this.square = coord instanceof Square ? coord : Square.at(Column.fromCharacter(columnNumberToCharacter(coord.column)), Row.fromNumber(coord.row));
    this.piece = pieceProvider(this.square);
    this.isChecked = checked;
    this.isSelected = selected
  }

  static withoutPiece(coord: { row: Square.Number, column: Square.Number } | Square): SquareView {
    return new SquareView(coord, () => undefined);
  }

  static fromHtml(squareElement: Element): SquareView {
    const squareId = squareElement.id;
    const pieceHtml = squareElement.firstElementChild;
    const piece = !pieceHtml ? undefined : Pieces.getBy(pieceHtml.getAttribute("app-name") as PieceName, pieceHtml.getAttribute("app-side") as Side);
    return new SquareView(Square.withId(squareId), () => piece, squareElement.classList.contains("checked-square"), pieceHtml ? pieceHtml.classList.contains("app-selected-square") : false);
  }

  withoutPiece(): SquareView {
    return new SquareView(this.square, () => undefined, this.isChecked, this.isSelected);
  }

  withPiece(piece: Piece): SquareView {
    return new SquareView(this.square, () => piece, this.isChecked, this.isSelected);
  }

  checked(): SquareView {
    return new SquareView(this.square, () => this.piece, true, this.isSelected);
  }

  unchecked(): SquareView {
    return new SquareView(this.square, () => this.piece, false, this.isSelected);
  }

  selected(): SquareView {
    return new SquareView(this.square, () => this.piece, this.isChecked, true);
  }

  notSelected(): SquareView {
    return new SquareView(this.square, () => this.piece, this.isChecked, false);
  }

  get pieceOnSquare(): Piece | undefined {
    return this.piece;
  }

  html(): HTMLElement {
    const squareView: HTMLDivElement = document.createElement("div");
    squareView.id = this.square.id;
    squareView.classList.add("square")
    squareView.classList.add(this.square.row.number % 2 == this.square.column.number % 2 ? "light" : "dark")
    if (this.isChecked) {
      squareView.classList.add("checked-square")
    }
    if (this.piece !== undefined) {
      squareView.innerHTML = FontAwesomePieceIcons.getBy(this.piece.name, this.piece.side);
      const pieceIcon = squareView.firstElementChild;
      if (pieceIcon) {
        pieceIcon.setAttribute("app-name", this.piece.name);
        pieceIcon.setAttribute("app-side", this.piece.side);
        pieceIcon.classList.add("app-piece-icon")
        if (this.isSelected) {
          squareView.classList.add("app-selected-square")
        }
      }
    }
    return squareView;
  }
}
