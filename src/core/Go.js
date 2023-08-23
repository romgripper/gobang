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
            placeStone: null,
            previousState: null
        };
    }

    getName() {
        return "go";
    }

    processPlaceStone(state, coordinate) {
        const nextBoard = state.board.clone();
        let isNextBlack = state.isNextBlack;
        let placeStone = true;
        if (state.board.getStone(coordinate).isStone()) {
            nextBoard.setStone(coordinate, null);
            placeStone = false;
        } else {
            nextBoard.setStone(coordinate, new Stone(state.isNextBlack).setBlink());
            isNextBlack = !isNextBlack;
        }

        return {
            isNextBlack: isNextBlack,
            board: nextBoard,
            placeStone: placeStone,
            previousState: state
        };
    }
}
