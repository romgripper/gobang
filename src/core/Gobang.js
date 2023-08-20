import { InvalidStone } from "./Stone";
import GameBase from "./GameBase";
import gobangCheckWinner from "./GobangWinnerChecker";
import gobangMarkWarnings from "./GobangWarningMarker";

const ROW_COUNT = 15;
const COLUMN_COUNT = 15;

export default class Gobang extends GameBase {
    INITIAL_STATE;

    constructor() {
        super(ROW_COUNT, COLUMN_COUNT);
        this.INITIAL_STATE = {
            isNextBlack: true,
            hasWinner: false,
            stones: super.createInitialStones(),
            latestStoneCoordinate: null,
            fix4InLineCoordinates: [],
            previousState: null
        };
    }

    getName() {
        return "gobang";
    }

    // return a virtual stone if out of board
    static getNthStoneInLine(stones, currentCoordinate, n, coordinateCalculator) {
        const coordinate = coordinateCalculator(currentCoordinate, n);
        return GameBase.isOutOfBoard(coordinate, ROW_COUNT, COLUMN_COUNT)
            ? new InvalidStone()
            : GameBase.getStone(stones, coordinate);
    }

    postProcess(newState) {
        newState.hasWinner = gobangCheckWinner(newState.stones, newState.latestStoneCoordinate);
        if (!newState.hasWinner) {
            newState.fix4InLineCoordinates = gobangMarkWarnings(newState.stones, newState.latestStoneCoordinate);
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
                if (GameBase.getStone(currentState.stones, coordinate).isNoStone()) return coordinate;
            }
        }
        return;
    }
}

export function stonesMatchPattern(indexPattern, getNth) {
    const first = getNth(indexPattern[0]);
    for (let i = 1; i < indexPattern.length; i++) {
        if (!isSameStone(first, getNth(indexPattern[i]))) return false;
    }
    return true;
}

function isSameStone(Stone1, Stone2) {
    return Stone1.isStone() && Stone2.isStone() && Stone1.isBlack() === Stone2.isBlack();
}
