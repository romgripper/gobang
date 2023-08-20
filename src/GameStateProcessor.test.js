import { createDispatcher } from "./core/GameStateProcessor";
import Game from "./core/Game";

const Gobang = Game.gobang;

const dispatch = createDispatcher(Gobang);
const INITIAL_STATE = Gobang.createInitialState(Gobang);

it("There is no winner before the black player places the first piece", () => {
    expect(INITIAL_STATE.hasWinner).toBe(false);
});

it("Black is the first no winner before the black player places the first piece", () => {
    expect(INITIAL_STATE.isNextBlack).toBe(true);
});

it("All stones are empty before the black player places the first piece", () => {
    INITIAL_STATE.stones.forEach((row) => row.forEach((stone) => expect(stone).toBe(null)));
});

it("No history before the black player places the first piece", () => {
    expect(INITIAL_STATE.previousState).toBe(null);
});

it("Game plays as expected", () => {
    const state0 = dispatch(INITIAL_STATE, { type: "rollback" });
    expect(state0).toBe(INITIAL_STATE);

    // black first [1, 1]
    const state1 = dispatch(state0, { type: "placeStone", coordinate: [1, 1] });
    expect(state1.stones[1][1].isNoStone()).toBe(false);
    expect(state1.stones[1][1].isBlack()).toBe(true);
    expect(state1.stones[1][1].isBlink()).toBe(true);
    expect(state1.stones[0][0]).toBe(null);
    expect(state1.isNextBlack).toBe(false);

    // white next [1, 2]
    const state2 = dispatch(state1, { type: "placeStone", coordinate: [1, 2] });
    expect(state2.stones[1][1].isNoStone()).toBe(false);
    expect(state2.stones[1][1].isBlack()).toBe(true);
    expect(state2.stones[1][1].isBlink()).toBe(false);
    expect(state2.stones[1][1].isNoStone()).toBe(false);
    expect(state2.stones[1][2].isBlack()).toBe(false);
    expect(state2.stones[1][2].isBlink()).toBe(true);
    expect(state2.stones[0][0]).toBe(null);
    expect(state2.isNextBlack).toBe(true);

    // rollback white
    const state3 = dispatch(state2, { type: "rollback" });
    expect(state3).toStrictEqual(state1);
    expect(state3.isNextBlack).toBe(false);

    // white next
    const state4 = dispatch(state3, { type: "placeStone", coordinate: [1, 2] });
    expect(state4).toStrictEqual(state2);
    expect(state4.isNextBlack).toBe(true);

    // click on a marked square, no effect
    const state5 = dispatch(state4, { type: "placeStone", coordinate: [1, 2] });
    expect(state5).toStrictEqual(state4);

    // black [2,1], black gets open 3
    let state = dispatch(state4, { type: "placeStone", coordinate: [2, 1] });
    // white [2,2]
    state = dispatch(state, { type: "placeStone", coordinate: [2, 2] });
    // black [3,1]
    state = dispatch(state, { type: "placeStone", coordinate: [3, 1] });
    expect(state.stones[1][1].isBlink()).toBe(true);
    expect(state.stones[2][1].isBlink()).toBe(true);
    expect(state.stones[3][1].isBlink()).toBe(true);

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
    expect(state.stones[1][1].isBlink()).toBe(true);
    expect(state.stones[2][1].isBlink()).toBe(true);
    expect(state.stones[3][1].isBlink()).toBe(true);
    expect(state.stones[4][1].isBlink()).toBe(true);

    // open 3 or open 4 only shows for latest move
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

    // black [5,1], black wins
    state = dispatch(state, { type: "placeStone", coordinate: [5, 1] });
    expect(state.hasWinner).toBe(true);
    expect(state.isNextBlack).toBe(false);
    expect(state.stones[5][1].isBlack()).toBe(true);

    expect(state.stones[1][1].isBlink()).toBe(true);
    expect(state.stones[2][1].isBlink()).toBe(true);
    expect(state.stones[3][1].isBlink()).toBe(true);
    expect(state.stones[4][1].isBlink()).toBe(true);
    expect(state.stones[5][1].isBlink()).toBe(true);

    // restart
    state = dispatch(state, { type: "restart" });
    expect(state).toStrictEqual(INITIAL_STATE);
});
