import Stone from "./Stone";

it("Construct a black Stone", () => {
    const stone = new Stone(true);
    expect(stone.isBlack()).toBe(true);
    expect(stone.isStone()).toBe(true);
    expect(stone.isVacancy()).toBe(false);
});

it("Construct a white Stone", () => {
    const stone = new Stone(false);
    expect(stone.isBlack()).toBe(false);
    expect(stone.isStone()).toBe(true);
    expect(stone.isVacancy()).toBe(false);
});

it("Set a stone to blink", () => {
    const stone = new Stone(true).setBlink();
    expect(stone.isBlink()).toBe(true);
});

it("Clone a stone", () => {
    const stone = new Stone(true);
    const stoneClone = stone.clone();
    expect(stoneClone).not.toBe(stone);
    expect(stoneClone).toStrictEqual(stone);
});

it("Cloning a stone won't clone blink status", () => {
    const stone = new Stone(true).setBlink();
    const stoneClone = stone.clone();
    expect(stone.isBlink()).toBe(true);
    expect(stoneClone.isBlink()).toBe(false);
});
