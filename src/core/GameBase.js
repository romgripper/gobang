import { EmptySquare } from "./SquareData";
import { Stone } from "./SquareData";

export default class GameBase {
    ROW_COUNT;
    COLUMN_COUNT;

    static COORDINATE_CALCULATORS = [
        ([row, column], n) => [row, column + n], // row
        ([row, column], n) => [row + n, column], // column
        ([row, column], n) => [row + n, column + n], // diagonal 1
        ([row, column], n) => [row + n, column - n] // diagonal 2
    ];

    constructor(rowCount, columnCount) {
        this.ROW_COUNT = rowCount;
        this.COLUMN_COUNT = columnCount;
    }

    getName() {
        throw new Error("Method 'getName()' must be implemented.");
    }

    createInitialSquares() {
        return Array(this.ROW_COUNT)
            .fill(null)
            .map(() => Array(this.COLUMN_COUNT).fill(null));
    }

    createInitialState() {
        throw new Error("Method 'createInitialState()' must be implemented.");
    }

    static isOutOfBoard([row, column], rowCount, columnCount) {
        return row < 0 || row >= rowCount || column < 0 || column >= columnCount;
    }

    // called after squares are updated, history is update, and players are switched in newState
    postProcess(state) {}

    determineNextStoneCoordinate(state) {}

    static getSquare(squares, [row, column]) {
        return squares[row][column] || new EmptySquare();
    }

    static getRow(squares, row) {
        return squares[row];
    }

    static setSquare(squares, [row, column], square) {
        squares[row][column] = square;
    }

    createDispatcher() {
        return (state, action) => {
            if (action.type === "placeStone") {
                const coordinate = action.coordinate;
                if (state.hasWinner || GameBase.getSquare(state.squares, coordinate).hasStone()) {
                    return state;
                }
                const nextSquares = state.squares.map((row) => row.map((square) => (square ? square.clone() : null)));
                GameBase.setSquare(nextSquares, coordinate, new Stone(state.isNextBlack).setBlink());

                const newState = {
                    isNextBlack: !state.isNextBlack,
                    squares: nextSquares,
                    latestStoneCoordinate: coordinate,
                    previousState: state
                };

                this.postProcess(newState);

                return newState;
            } else if (action.type === "rollback" && state.previousState) {
                return state.previousState;
            } else if (action.type === "restart") {
                return this.INITIAL_STATE;
            }
            return state;
        };
    }
}
