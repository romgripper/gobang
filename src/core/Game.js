import Utils from "./Utils";
import GoUtils from "./GoUtils";
import GobangUtils from "./GobangUtils";
import gobangCheckWinner from "./GobangWinnerChecker";
import gobangMarkWarnings from "./GobangWarningMarker";

// default export
const common = {
    getSquare: Utils.getSquare,
    getRow: Utils.getRow,
    setSquare: Utils.setSquare
};

const Game = {
    go: {
        ...common,
        name: "go",
        ROW_COUNT: GoUtils.ROW_COUNT,
        COLUMN_COUNT: GoUtils.COLUMN_COUNT,
        createInitialSquares: () => Utils.createInitialSquares(GoUtils.ROW_COUNT, GoUtils.COLUMN_COUNT),
        postProcess: () => false
    },
    gobang: {
        ...common,
        name: "gobang",
        ROW_COUNT: GobangUtils.ROW_COUNT,
        COLUMN_COUNT: GobangUtils.COLUMN_COUNT,
        createInitialSquares: () => Utils.createInitialSquares(GobangUtils.ROW_COUNT, GobangUtils.ROW_COUNT),
        postProcess: (square, currentCoordinate) => {
            const hasWinner = gobangCheckWinner(square, currentCoordinate);
            if (!hasWinner) {
                gobangMarkWarnings(square, currentCoordinate);
            }
            return hasWinner;
        }
    }
};

export default Game;
