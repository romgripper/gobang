import Game from "./Game";
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
            latestStoneCoordinate: null,
            fix4InLineCoordinates: [],
            previousState: null
        };
    }

    postProcess(newState) {
        newState.hasWinner = new GobangWinnerCheck(newState.board, newState.latestStoneCoordinate).checkWinning();
        if (!newState.hasWinner) {
            newState.fix4InLineCoordinates = new GobangWarningMarker(
                newState.board,
                newState.latestStoneCoordinate
            ).markWarnings();
        }
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
        if (state && state.fix4InLineCoordinates && state.fix4InLineCoordinates.length !== 0) {
            for (let i = 0; i < state.fix4InLineCoordinates.length; i++) {
                const coordinate = state.fix4InLineCoordinates[i];
                // need to check if it is empty because it could be fixed
                if (currentState.board.getStone(coordinate).isVacancy()) return coordinate;
            }
        }
        return;
    }
}
