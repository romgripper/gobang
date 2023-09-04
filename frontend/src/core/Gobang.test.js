import Gobang from "./Gobang";
import Vacancy from "./Vacancy";

const gobang = new Gobang();
const INITIAL_STATE = gobang.createInitialState();

it("All board.getStone are null before the black player places the first piece", () => {
    const board = INITIAL_STATE.board;
    for (let i = 0; i < board.getRowCount(); i++) {
        for (let j = 0; j < board.getColumnCount(); j++) {
            expect(board.getStone([i, j])).toBe(Vacancy.getInstance());
        }
    }
});

const dispatch = gobang.createDispatcher();

it("Game history works well", () => {
    expect(INITIAL_STATE.previousState).toBe(null);

    const state0 = rollback(INITIAL_STATE);
    expect(state0).toBe(INITIAL_STATE);

    // black first [1, 1]
    const state1 = placeStone(state0, [1, 1]);
    expect(state1.previousState).toBe(INITIAL_STATE);

    // white next [1, 2]
    const state2 = placeStone(state1, [1, 2]);
    expect(state2.previousState).toBe(state1);

    // rollback white
    const state3 = rollback(state2);
    expect(state3).toBe(state1);

    const state4 = rollback(state3);
    expect(state4).toBe(INITIAL_STATE);
});

it("Players always take turns", () => {
    let state = INITIAL_STATE;
    expect(state.isNextBlack).toBe(true);

    state = placeStone(state, [1, 1]);
    expect(state.board.getStone([1, 1]).isBlack()).toBe(true);
    expect(state.isNextBlack).toBe(false);

    state = placeStone(state, [1, 2]);
    expect(state.board.getStone([1, 1]).isBlack()).toBe(true);
    expect(state.board.getStone([1, 2]).isBlack()).toBe(false);
    expect(state.isNextBlack).toBe(true);

    state = rollback(state);
    expect(state.isNextBlack).toBe(false);

    state = rollback(state);
    expect(state.isNextBlack).toBe(true);
});

it("Latest stone blinks", () => {
    let state = INITIAL_STATE;
    expect(state.isNextBlack).toBe(true);

    state = placeStone(state, [1, 1]);
    expect(state.board.getStone([1, 1]).isBlink()).toBe(true);

    state = placeStone(state, [1, 2]);
    expect(state.board.getStone([1, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([1, 2]).isBlink()).toBe(true);
    expect(state.isNextBlack).toBe(true);
});

it("Latest stone coordinates are updated", () => {
    expect(INITIAL_STATE.latestStoneCoordinate).toBe(null);
    // black first [1, 1]
    let state = placeStone(INITIAL_STATE, [1, 1]);
    expect(state.latestStoneCoordinate).toStrictEqual([1, 1]);
    // white next [1, 2]
    state = placeStone(state, [1, 2]);
    expect(state.latestStoneCoordinate).toStrictEqual([1, 2]);
    // black [2,1]
    state = placeStone(state, [2, 1]);
    expect(state.latestStoneCoordinate).toStrictEqual([2, 1]);
});

it("No state change if place stone where there is already a stone", () => {
    const state0 = placeStone(INITIAL_STATE, [1, 1]);

    const state1 = placeStone(state0, [1, 1]);
    expect(state1).toBe(state0);
});

it("Latest 3-in-line, 4-in-line, or 5-in-line blinks", () => {
    // black first [1, 1]
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        // white next [1, 2]
        [1, 2],
        // black [2,1]
        [2, 1],
        // white [2,2]
        [2, 2],
        // black [3,1]
        [3, 1]
    ]);
    expect(state.board.getStone([1, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([2, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([3, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([2, 2]).isBlink()).toBe(false);

    // white [3,2]
    state = placeStone(state, [3, 2]);
    // open 3 or open 4 only shows for latest move
    expect(state.board.getStone([1, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([2, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([3, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([1, 2]).isBlink()).toBe(true);
    expect(state.board.getStone([2, 2]).isBlink()).toBe(true);
    expect(state.board.getStone([3, 2]).isBlink()).toBe(true);

    // black [4,1], black gets open 4
    state = placeStone(state, [4, 1]);
    // open 3 or open 4 only shows for latest move
    expect(state.board.getStone([1, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([2, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([3, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([4, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([1, 2]).isBlink()).toBe(false);
    expect(state.board.getStone([2, 2]).isBlink()).toBe(false);
    expect(state.board.getStone([3, 2]).isBlink()).toBe(false);

    // white [4,2], white gets open 4
    state = placeStone(state, [4, 2]);
    // open 3 or open 4 only shows for latest move
    expect(state.board.getStone([1, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([2, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([3, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([4, 1]).isBlink()).toBe(false);
    expect(state.board.getStone([1, 2]).isBlink()).toBe(true);
    expect(state.board.getStone([2, 2]).isBlink()).toBe(true);
    expect(state.board.getStone([3, 2]).isBlink()).toBe(true);
    expect(state.board.getStone([4, 2]).isBlink()).toBe(true);

    // black [5,1], 5-in-line
    state = placeStone(state, [5, 1]);
    expect(state.board.getStone([1, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([2, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([3, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([4, 1]).isBlink()).toBe(true);
    expect(state.board.getStone([5, 1]).isBlink()).toBe(true);
});

it("Vertical 5-in-line wins", () => {
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
        [3, 1],
        [3, 2],
        [4, 1],
        [4, 2]
    ]);
    expect(state.hasWinner).toBe(false);
    state = placeStone(state, [5, 1]);
    expect(state.hasWinner).toBe(true);
});

it("Horizontal 5-in-line wins", () => {
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        [1, 2],
        [2, 1],
        [1, 3],
        [3, 1],
        [1, 4],
        [4, 1],
        [1, 6],
        [10, 10]
    ]);
    expect(state.hasWinner).toBe(false);
    state = placeStone(state, [1, 5]);
    expect(state.hasWinner).toBe(true);
});

it("Forward diagonal 5-in-line wins", () => {
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        [0, 0],
        [2, 2],
        [0, 1],
        [3, 3],
        [0, 2],
        [4, 4],
        [0, 3]
    ]);
    expect(state.hasWinner).toBe(false);
    state = placeStone(state, [5, 5]);
    expect(state.hasWinner).toBe(true);
});

it("Backward diagonal 5-in-line wins", () => {
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        [4, 0],
        [12, 12],
        [3, 1],
        [3, 3],
        [1, 3],
        [4, 4],
        [0, 4],
        [10, 10]
    ]);
    expect(state.hasWinner).toBe(false);
    state = placeStone(state, [2, 2]);
    expect(state.hasWinner).toBe(true);
});

it("Restart the game to initial state", () => {
    let state = placeStone(INITIAL_STATE, [1, 1]);
    state = placeStone(state, [1, 2]);
    state = placeStone(state, [2, 1]);
    state = placeStone(state, [2, 2]);
    state = restart(state);
    expect(state).toStrictEqual(INITIAL_STATE);
});

it("Point out 2 positions for two-end-open 4-in-line", () => {
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
        [3, 1],
        [3, 2],
        [4, 1]
    ]);
    // black gets open 4-in-line
    expect(state.blocking4InLineCoordinates).toStrictEqual([
        [0, 1],
        [5, 1]
    ]);
    // white [4,2], white gets open 4-in-line
    state = placeStones(state, [[4, 2]]);
    expect(state.blocking4InLineCoordinates).toStrictEqual([
        [0, 2],
        [5, 2]
    ]);
});

it("Point out 1 position for one-end-open 4-in-line", () => {
    let state = placeStones(INITIAL_STATE, [
        [10, 10],
        [9, 9],
        [11, 11],
        [2, 2],
        [13, 13],
        [3, 2],
        [14, 14]
    ]);
    // black gets open 4-in-line
    expect(state.blocking4InLineCoordinates).toStrictEqual([[12, 12]]);
});

it("Gobang supports auto placement", () => {
    expect(gobang.supportAutoPlacement()).toBe(true);
});

it("Gobang determines next stone coordinates which could block 4-in-lines", () => {
    let state = placeStones(INITIAL_STATE, [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
        [3, 1],
        [3, 2],
        [4, 1]
    ]);
    // one of the two positions blocking black 4-in-line is returned
    expect(gobang.autoDetermineNextStoneCoordinate(state)).toStrictEqual([0, 1]);
    // white places at [0,1] to block 4-in-line at one end
    state = placeStones(state, [[0, 1]]);
    // black place at [5,1] to form 5-in-line at the other end
    expect(gobang.autoDetermineNextStoneCoordinate(state)).toStrictEqual([5, 1]);
});

function placeStone(state, coordinate) {
    return dispatch(state, gobang.createPlaceStoneAction(coordinate));
}

function rollback(state) {
    return dispatch(state, gobang.createRollbackAction());
}

function restart(state) {
    return dispatch(state, gobang.createRestartAction());
}

function placeStones(initialState, coordinates) {
    let state = initialState;
    coordinates.forEach((coordinate) => {
        state = placeStone(state, coordinate);
    });
    return state;
}
