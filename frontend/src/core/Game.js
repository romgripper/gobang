import Board from "./Board";

export default class Game {
    static #PLACE_STONE = "placeStone";
    static #ROLLBACK = "rollback";
    static #RESTART = "restart";
    static #PLACE_STONES = "placeStones";
    static #SYNC_MOVES = "syncMoves";

    ROW_COUNT;
    COLUMN_COUNT;

    constructor(rowCount, columnCount) {
        this.ROW_COUNT = rowCount;
        this.COLUMN_COUNT = columnCount;
    }

    getRowCount() {
        return this.ROW_COUNT;
    }

    getColumnCount() {
        return this.COLUMN_COUNT;
    }

    getName() {
        throw new Error("Method 'getName()' must be implemented.");
    }

    createInitialState() {
        throw new Error("Method 'createInitialState()' must be implemented.");
    }

    createInitialBoard() {
        return new Board(this.ROW_COUNT, this.COLUMN_COUNT);
    }

    supportAutoPlacement() {
        return false;
    }

    autoDetermineNextStoneCoordinate(state) {}

    processPlaceStone(state, coordinate) {
        throw new Error("Method 'processPlaceStone()' must be implemented.");
    }

    createPlaceStoneAction(coordinate) {
        return {
            type: Game.#PLACE_STONE,
            coordinate
        };
    }

    createPlaceStonesAction(coordinates) {
        return {
            type: Game.#PLACE_STONES,
            coordinates
        };
    }

    createRollbackAction() {
        return {
            type: Game.#ROLLBACK
        };
    }

    createRestartAction() {
        return {
            type: Game.#RESTART
        };
    }

    #getHistoricalMoves(state) {
        const historicalMoves = [];

        let s = state;
        while (s.previousState) {
            historicalMoves.unshift(s.latestMove);
            s = s.previousState;
        }

        return historicalMoves;
    }

    createSyncMoveActions(state) {
        const historicalMoves = this.#getHistoricalMoves(state);
        const actions = [];
        const actionCount = Math.ceil(historicalMoves.length / this.COLUMN_COUNT);
        for (let i = 0; i < actionCount; i++) {
            const moves = [];
            for (let j = 0; j < this.COLUMN_COUNT; j++) {
                const move = historicalMoves[i * this.COLUMN_COUNT + j];
                if (move) {
                    moves.push(move);
                }
            }
            actions.push({ type: Game.#SYNC_MOVES, moves: moves, index: i, count: actionCount });
        }
        return actions;
    }

    process(state, action) {
        if (state.freeze && action.type !== Game.#SYNC_MOVES) {
            console.log("Game is frozen, ignoring action:", action.type);
            return state;
        }

        switch (action.type) {
            case Game.#PLACE_STONE:
                return this.processPlaceStone(state, action.coordinate);
            case Game.#ROLLBACK:
                return state.previousState || state;
            case Game.#RESTART:
                return this.createInitialState();
            case Game.#PLACE_STONES:
                let newState = state;
                for (let coordinate of action.coordinates) {
                    newState = this.processPlaceStone(newState, coordinate);
                }
                return newState;
            case Game.#SYNC_MOVES:
                state.freeze = true;
                this.cacheSyncMoves(state, action);
                if (this.isSyncMovesCacheFull(state)) {
                    state.freeze = false;
                    const newState = this.processCachedMoves(state);
                    this.clearSyncMovesCache(state);
                    return newState;
                }
                return state;
            default:
                return state;
        }
    }

    createDispatcher() {
        return (state, action) => this.process(state, action);
    }

    cacheSyncMoves(state, action) {
        if (!state.receivedSyncMoves) state.receivedSyncMoves = Array(action.count).fill(null);
        state.receivedSyncMoves[action.index] = action.moves;
    }

    isSyncMovesCacheFull(state) {
        for (const moves of state.receivedSyncMoves) {
            if (!moves) return false;
        }
        return true;
    }

    processCachedMoves(state) {
        let newState = state;
        for (const moves of state.receivedSyncMoves) {
            newState = this.process(newState, this.createPlaceStonesAction(moves));
        }
        return newState;
    }

    clearSyncMovesCache(state) {
        state.receivedSyncMoves = null;
    }
}
