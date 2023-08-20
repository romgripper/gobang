import Game from "./Game";
import Util from "./Util";
import GobangUtil from "./GobangUtil";
import GobangWinnerCheck from "./GobangWinningChecker";
import GobangWarningMarker from "./GobangWarningMarker";

export default class Gobang extends Game {
    constructor() {
        super(GobangUtil.ROW_COUNT, GobangUtil.COLUMN_COUNT);
    }

    getName() {
        return "gobang";
    }

    createInitialState() {
        return {
            isNextBlack: true,
            hasWinner: false,
            stones: this.createInitialStones(),
            latestStoneCoordinate: null,
            fix4InLineCoordinates: [],
            previousState: null
        };
    }

    postProcess(newState) {
        newState.hasWinner = new GobangWinnerCheck(newState.stones, newState.latestStoneCoordinate).checkWinning();
        if (!newState.hasWinner) {
            newState.fix4InLineCoordinates = new GobangWarningMarker(
                newState.stones,
                newState.latestStoneCoordinate
            ).markWarnings();
        }
    }

    autoPlace(state) {
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
                if (Util.getStone(currentState.stones, coordinate).isVacancy()) return coordinate;
            }
        }
        return;
    }
}
