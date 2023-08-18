import Utils from "./Utils";
import GoUtils from "./GoUtils";
import GobangUtils from "./GobangUtils";
import gobangCheckWinner from "./GobangWinnerChecker";
import gobangMarkWarnings from "./GobangWarningMarker";

const common = {
    getSquare: Utils.getSquare,
    getRow: Utils.getRow,
    setSquare: Utils.setSquare
};

function gobangCheckWinnerAndMarkWarnings(newState) {
    newState.hasWinner = gobangCheckWinner(newState.squares, newState.latestStoneCoordinate);
    if (!newState.hasWinner) {
        newState.fix4InLineCoordinates = gobangMarkWarnings(newState.squares, newState.latestStoneCoordinate);
    }
}

const Game = {
    go: {
        ...common,
        name: "go",
        ROW_COUNT: GoUtils.ROW_COUNT,
        COLUMN_COUNT: GoUtils.COLUMN_COUNT,
        createInitialState: () => ({
            isNextBlack: true,
            hasWinner: false,
            squares: Utils.createInitialSquares(GoUtils.ROW_COUNT, GoUtils.COLUMN_COUNT),
            latestStoneCoordinate: null,
            previousState: null
        }),
        postProcess: (state) => {},
        autoPlace: (state) => null
    },
    gobang: {
        ...common,
        name: "gobang",
        ROW_COUNT: GobangUtils.ROW_COUNT,
        COLUMN_COUNT: GobangUtils.COLUMN_COUNT,
        createInitialState: () => ({
            isNextBlack: true,
            hasWinner: false,
            squares: Utils.createInitialSquares(GobangUtils.ROW_COUNT, GobangUtils.COLUMN_COUNT),
            latestStoneCoordinate: null,
            fix4InLineCoordinates: [],
            previousState: null
        }),
        // called after squares are updated, history is update, and players are switched in newState
        postProcess: gobangCheckWinnerAndMarkWarnings,
        autoPlace: (state) => {
            // the stone coordinate for next player to form 5-in-line
            if (state.previousState && state.previousState.fix4InLineCoordinates.length !== 0) {
                for (let i = 0; i < state.previousState.fix4InLineCoordinates.length; i++) {
                    const coordinate = state.previousState.fix4InLineCoordinates[i];
                    // need to check if it is empty because it could be fixed
                    if (Utils.getSquare(state.squares, coordinate).isEmpty()) {
                        return coordinate;
                    }
                }
                return;
            }
            const nextPlayerWinCoordinate = getOpenCoordinateFor4InLine(state.previousState);
            if (nextPlayerWinCoordinate) return nextPlayerWinCoordinate;
            // the stone coordinate for next player to prevent current player to form 5-in-line
            return getOpenCoordinateFor4InLine(state);
        }
    }
};

export default Game;

function getOpenCoordinateFor4InLine(state) {
    if (state && state.fix4InLineCoordinates && state.fix4InLineCoordinates.length !== 0) {
        for (let i = 0; i < state.fix4InLineCoordinates.length; i++) {
            const coordinate = state.fix4InLineCoordinates[i];
            // need to check if it is empty because it could be fixed
            if (Utils.getSquare(state.squares, coordinate).isEmpty()) {
                return coordinate;
            }
        }
    }
    return;
}
