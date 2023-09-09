import Game from "./Game";
import Stone from "./Stone";

export default class Go extends Game {
    constructor() {
        super(19, 19);
    }

    createInitialState() {
        return {
            isNextBlack: true,
            hasWinner: false,
            board: this.createInitialBoard(),
            latestMove: null,
            previousState: null
        };
    }

    getName() {
        return "go";
    }

    processPlaceStone(state, coordinate) {
        const nextBoard = state.board.clone();
        let isNextBlack = state.isNextBlack;
        if (state.board.getStone(coordinate).isStone()) {
            nextBoard.setStone(coordinate, null);
        } else {
            nextBoard.setStone(coordinate, new Stone(state.isNextBlack).setBlink());
            isNextBlack = !isNextBlack;
        }

        return {
            isNextBlack: isNextBlack,
            board: nextBoard,
            latestMove: coordinate,
            previousState: state
        };
    }
}
