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
    if (!newState.latestStoneCoordinate) return;

    newState.hasWinner = gobangCheckWinner(newState.squares, newState.latestStoneCoordinate);
    if (!newState.hasWinner) {
        gobangMarkWarnings(newState.squares, newState.latestStoneCoordinate);
    }
}

const Game = {
    go: {
        ...common,
        name: "go",
        ROW_COUNT: GoUtils.ROW_COUNT,
        COLUMN_COUNT: GoUtils.COLUMN_COUNT,
        createInitialSquares: () => Utils.createInitialSquares(GoUtils.ROW_COUNT, GoUtils.COLUMN_COUNT),
        postProcess: (state) => {},
        autoPlace: (state) => null
    },
    gobang: {
        ...common,
        name: "gobang",
        ROW_COUNT: GobangUtils.ROW_COUNT,
        COLUMN_COUNT: GobangUtils.COLUMN_COUNT,
        createInitialSquares: () => Utils.createInitialSquares(GobangUtils.ROW_COUNT, GobangUtils.ROW_COUNT),
        // called after squares are updated, history is update, and players are switched in newState
        postProcess: gobangCheckWinnerAndMarkWarnings,
        autoPlace: (state) => {
            console.log("autoPlace");
            return null;
        }
    }
};

export default Game;
