import { INITIAL_STATE, process } from "./GameStateProcessor";

it("There is no winner before the black player places the first piece", () => {
    expect(INITIAL_STATE.hasWinner).toBe(false);
});

it("Black is the first no winner before the black player places the first piece", () => {
    expect(INITIAL_STATE.isNextBlack).toBe(true);
});

it("All squares are empty before the black player places the first piece", () => {
    INITIAL_STATE.squares.forEach((row) => row.forEach((square) => expect(square.isEmpty()).toBe(true)));
});

it("No history before the black player places the first piece", () => {
    expect(INITIAL_STATE.previousState).toBe(null);
});

it("Game plays as expected", () => {
    const state0 = process(INITIAL_STATE, { type: "rollback" });
    expect(state0).toBe(INITIAL_STATE);

    // black first [1, 1]
    const state1 = process(state0, { type: "click", coordinate: [1, 1] });
    expect(state1.squares[1][1].isEmpty()).toBe(false);
    expect(state1.squares[1][1].isBlack()).toBe(true);
    expect(state1.squares[0][0].isEmpty()).toBe(true);
    expect(state1.isNextBlack).toBe(false);

    // white next [1, 2]
    const state2 = process(state1, { type: "click", coordinate: [1, 2] });
    expect(state2.squares[1][1].isEmpty()).toBe(false);
    expect(state2.squares[1][1].isBlack()).toBe(true);
    expect(state2.squares[1][1].isEmpty()).toBe(false);
    expect(state2.squares[1][2].isBlack()).toBe(false);
    expect(state2.squares[0][0].isEmpty()).toBe(true);
    expect(state2.isNextBlack).toBe(true);

    // rollback white
    const state3 = process(state2, { type: "rollback" });
    expect(state3).toStrictEqual(state1);
    expect(state3.isNextBlack).toBe(false);

    // white next
    const state4 = process(state3, { type: "click", coordinate: [1, 2] });
    expect(state4).toStrictEqual(state2);
    expect(state4.isNextBlack).toBe(true);

    // click on a marked square, no effect
    const state5 = process(state4, { type: "click", coordinate: [1, 2] });
    expect(state5).toStrictEqual(state4);

    // black [2,1], black gets open 3
    let state = process(state4, { type: "click", coordinate: [2, 1] });
    // white [2,2]
    state = process(state, { type: "click", coordinate: [2, 2] });
    // black [3,1]
    state = process(state, { type: "click", coordinate: [3, 1] });
    expect(state.squares[1][1].isInOpen3()).toBe(true);
    expect(state.squares[2][1].isInOpen3()).toBe(true);
    expect(state.squares[3][1].isInOpen3()).toBe(true);
    expect(state.squares[1][1].isInOpen4()).toBe(false);
    expect(state.squares[2][1].isInOpen4()).toBe(false);
    expect(state.squares[3][1].isInOpen4()).toBe(false);

    // white [3,2]
    state = process(state, { type: "click", coordinate: [3, 2] });
    // open 3 or open 4 only shows for latest move
    expect(state.squares[1][1].isInOpen3()).toBe(false);
    expect(state.squares[2][1].isInOpen3()).toBe(false);
    expect(state.squares[3][1].isInOpen3()).toBe(false);
    expect(state.squares[1][1].isInOpen4()).toBe(false);
    expect(state.squares[2][1].isInOpen4()).toBe(false);
    expect(state.squares[3][1].isInOpen4()).toBe(false);

    expect(state.squares[1][2].isInOpen3()).toBe(true);
    expect(state.squares[2][2].isInOpen3()).toBe(true);
    expect(state.squares[3][2].isInOpen3()).toBe(true);
    expect(state.squares[1][2].isInOpen4()).toBe(false);
    expect(state.squares[2][2].isInOpen4()).toBe(false);
    expect(state.squares[3][2].isInOpen4()).toBe(false);

    // black [4,1], black gets open 4
    state = process(state, { type: "click", coordinate: [4, 1] });
    expect(state.squares[1][1].isInOpen3()).toBe(false);
    expect(state.squares[2][1].isInOpen3()).toBe(false);
    expect(state.squares[3][1].isInOpen3()).toBe(false);
    expect(state.squares[4][1].isInOpen3()).toBe(false);
    expect(state.squares[1][1].isInOpen4()).toBe(true);
    expect(state.squares[2][1].isInOpen4()).toBe(true);
    expect(state.squares[3][1].isInOpen4()).toBe(true);
    expect(state.squares[4][1].isInOpen4()).toBe(true);

    // open 3 or open 4 only shows for latest move
    expect(state.squares[1][2].isInOpen3()).toBe(false);
    expect(state.squares[2][2].isInOpen3()).toBe(false);
    expect(state.squares[3][2].isInOpen3()).toBe(false);
    expect(state.squares[1][2].isInOpen4()).toBe(false);
    expect(state.squares[2][2].isInOpen4()).toBe(false);
    expect(state.squares[3][2].isInOpen4()).toBe(false);

    // white [4,2], white gets open 4
    state = process(state, { type: "click", coordinate: [4, 2] });
    // open 3 or open 4 only shows for latest move
    expect(state.squares[1][1].isInOpen3()).toBe(false);
    expect(state.squares[2][1].isInOpen3()).toBe(false);
    expect(state.squares[3][1].isInOpen3()).toBe(false);
    expect(state.squares[4][1].isInOpen3()).toBe(false);
    expect(state.squares[1][1].isInOpen4()).toBe(false);
    expect(state.squares[2][1].isInOpen4()).toBe(false);
    expect(state.squares[3][1].isInOpen4()).toBe(false);
    expect(state.squares[4][1].isInOpen4()).toBe(false);

    expect(state.squares[1][2].isInOpen3()).toBe(false);
    expect(state.squares[2][2].isInOpen3()).toBe(false);
    expect(state.squares[3][2].isInOpen3()).toBe(false);
    expect(state.squares[4][2].isInOpen3()).toBe(false);
    expect(state.squares[1][2].isInOpen4()).toBe(true);
    expect(state.squares[2][2].isInOpen4()).toBe(true);
    expect(state.squares[3][2].isInOpen4()).toBe(true);
    expect(state.squares[4][2].isInOpen4()).toBe(true);

    // black [5,1], black wins
    state = process(state, { type: "click", coordinate: [5, 1] });
    expect(state.hasWinner).toBe(true);
    expect(state.isNextBlack).toBe(false);
    expect(state.squares[5][1].isBlack()).toBe(true);

    expect(state.squares[1][1].isInOpen3()).toBe(false);
    expect(state.squares[2][1].isInOpen3()).toBe(false);
    expect(state.squares[3][1].isInOpen3()).toBe(false);
    expect(state.squares[4][1].isInOpen3()).toBe(false);
    expect(state.squares[5][1].isInOpen3()).toBe(false);
    expect(state.squares[1][1].isInOpen4()).toBe(false);
    expect(state.squares[2][1].isInOpen4()).toBe(false);
    expect(state.squares[3][1].isInOpen4()).toBe(false);
    expect(state.squares[4][1].isInOpen4()).toBe(false);
    expect(state.squares[5][1].isInOpen4()).toBe(false);

    expect(state.squares[1][1].isIn5()).toBe(true);
    expect(state.squares[2][1].isIn5()).toBe(true);
    expect(state.squares[3][1].isIn5()).toBe(true);
    expect(state.squares[4][1].isIn5()).toBe(true);
    expect(state.squares[5][1].isIn5()).toBe(true);

    // restart
    state = process(state, { type: "restart" });
    expect(state).toStrictEqual(INITIAL_STATE);
});
