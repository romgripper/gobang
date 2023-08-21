import Gobang from "./Gobang";
import GobangUtil from "./GobangUtil";

const gobang = new Gobang();
const INITIAL_STATE = gobang.createInitialState();

it("There is no winner before the black player places the first piece", () => {
    expect(INITIAL_STATE.hasWinner).toBe(false);
});

it("All stones are null before the black player places the first piece", () => {
    INITIAL_STATE.stones.forEach((row) => {
        expect(row.length).toBe(GobangUtil.COLUMN_COUNT);
        row.forEach((stone) => expect(stone).toBe(null));
    });
    expect(INITIAL_STATE.stones.length).toBe(GobangUtil.ROW_COUNT);
});

it("No latest stone coordinate set before the black player places the first piece", () => {
    expect(INITIAL_STATE.latestStoneCoordinate).toBe(null);
});

const dispatch = gobang.createDispatcher();

it("Game history works well", () => {
    expect(INITIAL_STATE.previousState).toBe(null);

    const state0 = dispatch(INITIAL_STATE, { type: "rollback" });
    expect(state0).toBe(INITIAL_STATE);

    // black first [1, 1]
    const state1 = dispatch(state0, { type: "placeStone", coordinate: [1, 1] });
    expect(state1.previousState).toBe(INITIAL_STATE);

    // white next [1, 2]
    const state2 = dispatch(state1, { type: "placeStone", coordinate: [1, 2] });
    expect(state2.previousState).toBe(state1);

    // rollback white
    const state3 = dispatch(state2, { type: "rollback" });
    expect(state3).toBe(state1);

    const state4 = dispatch(state3, { type: "rollback" });
    expect(state4).toBe(INITIAL_STATE);
});

it("Players always take turns", () => {
    let state = INITIAL_STATE;
    expect(state.isNextBlack).toBe(true);

    state = dispatch(state, { type: "placeStone", coordinate: [1, 1] });
    expect(state.stones[1][1].isBlack()).toBe(true);
    expect(state.isNextBlack).toBe(false);

    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    expect(state.stones[1][1].isBlack()).toBe(true);
    expect(state.stones[1][2].isBlack()).toBe(false);
    expect(state.isNextBlack).toBe(true);

    state = dispatch(state, { type: "rollback" });
    expect(state.isNextBlack).toBe(false);

    state = dispatch(state, { type: "rollback" });
    expect(state.isNextBlack).toBe(true);
});

it("Latest stone blinks", () => {
    let state = INITIAL_STATE;
    expect(state.isNextBlack).toBe(true);

    state = dispatch(state, { type: "placeStone", coordinate: [1, 1] });
    expect(state.stones[1][1].isBlink()).toBe(true);

    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    expect(state.stones[1][1].isBlink()).toBe(false);
    expect(state.stones[1][2].isBlink()).toBe(true);
    expect(state.isNextBlack).toBe(true);
});

it("Latest stone coordinate is recorded", () => {
    // black first [1, 1]
    let state = dispatch(INITIAL_STATE, { type: "placeStone", coordinate: [1, 1] });
    expect(state.latestStoneCoordinate).toStrictEqual([1, 1]);
    // white next [1, 2]
    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    expect(state.latestStoneCoordinate).toStrictEqual([1, 2]);
    // black [2,1]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 1] });
    expect(state.latestStoneCoordinate).toStrictEqual([2, 1]);
});

it("No state change if place stone where there is already a stone", () => {
    const state0 = dispatch(INITIAL_STATE, { type: "placeStone", coordinate: [1, 1] });

    const state1 = dispatch(state0, { type: "placeStone", coordinate: [1, 1] });
    expect(state1).toBe(state0);
});

it("Latest 3-in-line, 4-in-line, or 5-in-line blinks", () => {
    // black first [1, 1]
    let state = dispatch(INITIAL_STATE, { type: "placeStone", coordinate: [1, 1] });
    // white next [1, 2]
    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    // black [2,1]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 1] });
    // white [2,2]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 2] });
    // black [3,1]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 1] });
    expect(state.stones[1][1].isBlink()).toBe(true);
    expect(state.stones[2][1].isBlink()).toBe(true);
    expect(state.stones[3][1].isBlink()).toBe(true);
    expect(state.stones[2][2].isBlink()).toBe(false);

    // white [3,2]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 2] });
    // open 3 or open 4 only shows for latest move
    expect(state.stones[1][1].isBlink()).toBe(false);
    expect(state.stones[2][1].isBlink()).toBe(false);
    expect(state.stones[3][1].isBlink()).toBe(false);
    expect(state.stones[1][2].isBlink()).toBe(true);
    expect(state.stones[2][2].isBlink()).toBe(true);
    expect(state.stones[3][2].isBlink()).toBe(true);

    // black [4,1], black gets open 4
    state = dispatch(state, { type: "placeStone", coordinate: [4, 1] });
    // open 3 or open 4 only shows for latest move
    expect(state.stones[1][1].isBlink()).toBe(true);
    expect(state.stones[2][1].isBlink()).toBe(true);
    expect(state.stones[3][1].isBlink()).toBe(true);
    expect(state.stones[4][1].isBlink()).toBe(true);
    expect(state.stones[1][2].isBlink()).toBe(false);
    expect(state.stones[2][2].isBlink()).toBe(false);
    expect(state.stones[3][2].isBlink()).toBe(false);

    // white [4,2], white gets open 4
    state = dispatch(state, { type: "placeStone", coordinate: [4, 2] });
    // open 3 or open 4 only shows for latest move
    expect(state.stones[1][1].isBlink()).toBe(false);
    expect(state.stones[2][1].isBlink()).toBe(false);
    expect(state.stones[3][1].isBlink()).toBe(false);
    expect(state.stones[4][1].isBlink()).toBe(false);
    expect(state.stones[1][2].isBlink()).toBe(true);
    expect(state.stones[2][2].isBlink()).toBe(true);
    expect(state.stones[3][2].isBlink()).toBe(true);
    expect(state.stones[4][2].isBlink()).toBe(true);

    // black [5,1], 5-in-line
    state = dispatch(state, { type: "placeStone", coordinate: [5, 1] });
    expect(state.stones[1][1].isBlink()).toBe(true);
    expect(state.stones[2][1].isBlink()).toBe(true);
    expect(state.stones[3][1].isBlink()).toBe(true);
    expect(state.stones[4][1].isBlink()).toBe(true);
    expect(state.stones[5][1].isBlink()).toBe(true);
});

it("5-in-line wins", () => {
    // black first [1, 1]
    let state = dispatch(INITIAL_STATE, { type: "placeStone", coordinate: [1, 1] });
    // white next [1, 2]
    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    // black [2,1]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 1] });
    // white [2,2]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 2] });
    // black [3,1]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 1] });
    // white [3,2]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 2] });
    // black [4,1], black gets open 4
    state = dispatch(state, { type: "placeStone", coordinate: [4, 1] });
    // white [4,2], white gets open 4
    state = dispatch(state, { type: "placeStone", coordinate: [4, 2] });
    // black [5,1], black wins
    state = dispatch(state, { type: "placeStone", coordinate: [5, 1] });
    expect(state.hasWinner).toBe(true);
});

it("Restart the game to initial state", () => {
    let state = dispatch(INITIAL_STATE, { type: "placeStone", coordinate: [1, 1] });
    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    state = dispatch(state, { type: "placeStone", coordinate: [2, 1] });
    state = dispatch(state, { type: "placeStone", coordinate: [2, 2] });
    state = dispatch(state, { type: "restart" });
    expect(state).toStrictEqual(INITIAL_STATE);
});

it("Point 4-in-line fixes", () => {
    // black first [1, 1]
    let state = dispatch(INITIAL_STATE, { type: "placeStone", coordinate: [1, 1] });
    // white next [1, 2]
    state = dispatch(state, { type: "placeStone", coordinate: [1, 2] });
    // black [2,1]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 1] });
    // white [2,2]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 2] });
    // black [3,1]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 1] });
    // white [3,2]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 2] });
    expect(state.fix4InLineCoordinates).toStrictEqual([]);
    // black [4,1], black gets open 4
    state = dispatch(state, { type: "placeStone", coordinate: [4, 1] });
    expect(state.fix4InLineCoordinates).toStrictEqual([
        [0, 1],
        [5, 1]
    ]);
    // white [4,2], white gets open 4
    state = dispatch(state, { type: "placeStone", coordinate: [4, 2] });
    expect(state.fix4InLineCoordinates).toStrictEqual([
        [0, 2],
        [5, 2]
    ]);
});

//autoDetermineNextStoneCoordinate
