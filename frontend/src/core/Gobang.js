import Game from "./Game";
import Stone from "./Stone";
import GobangWinnerCheck from "./GobangWinningChecker";
import GobangWarningMarker from "./GobangWarningMarker";

export default class Gobang extends Game {
    constructor() {
        super(15, 15);
    }

    getName() {
        return "gobang";
    }

    createInitialState() {
        return {
            isNextBlack: true,
            hasWinner: false,
            board: this.createInitialBoard(),
            latestMove: null,
            blocking4InLineCoordinates: [],
            previousState: null
        };
    }

    processPlaceStone(state, coordinate) {
        if (state.hasWinner || state.board.getStone(coordinate).isStone()) {
            return state;
        }
        const nextBoard = state.board.clone();
        nextBoard.setStone(coordinate, new Stone(state.isNextBlack).setBlink());

        const hasWinner = new GobangWinnerCheck(nextBoard, coordinate).checkWinning();
        const blocking4InLineCoordinates = hasWinner
            ? []
            : new GobangWarningMarker(nextBoard, coordinate).markWarnings();

        return {
            isNextBlack: !state.isNextBlack,
            board: nextBoard,
            latestMove: coordinate,
            previousState: state,
            hasWinner: hasWinner,
            blocking4InLineCoordinates: blocking4InLineCoordinates
        };
    }

    supportAutoPlacement() {
        return true;
    }

    autoDetermineNextStoneCoordinate(state) {
        // the stone coordinate for next player to form 5-in-line
        const nextPlayerWinCoordinate = this.#getOpenCoordinateFor4InLine(state.previousState, state);
        if (nextPlayerWinCoordinate) return nextPlayerWinCoordinate;
        // the stone coordinate for next player to prevent current player to form 5-in-line
        return this.#getOpenCoordinateFor4InLine(state, state);
    }

    #getOpenCoordinateFor4InLine(state, currentState) {
        if (state && state.blocking4InLineCoordinates && state.blocking4InLineCoordinates.length !== 0) {
            for (let i = 0; i < state.blocking4InLineCoordinates.length; i++) {
                const coordinate = state.blocking4InLineCoordinates[i];
                // need to check if it is empty because it could be fixed
                if (currentState.board.getStone(coordinate).isVacancy()) return coordinate;
            }
        }
        return;
    }
}
