import Utils from "./Utils";
import GoUtils from "./GoUtils";
import GobangUtils from "./GobangUtils";

// default export
const common = {
    getSquare: Utils.getSquare,
    getRow: Utils.getRow,
    setSquare: Utils.setSquare
};

const Game = {
    go: {
        ...common,
        ROW_COUNT: GoUtils.ROW_COUNT,
        COLUMN_COUNT: GoUtils.COLUMN_COUNT,
        INITIAL_SQUARES: Utils.createInitialSquares(GoUtils.ROW_COUNT, GoUtils.COLUMN_COUNT)
    },
    gobang: {
        ...common,
        ROW_COUNT: GobangUtils.ROW_COUNT,
        COLUMN_COUNT: GobangUtils.COLUMN_COUNT,
        INITIAL_SQUARES: Utils.createInitialSquares(GobangUtils.ROW_COUNT, GobangUtils.ROW_COUNT)
    }
};

export default Game;
