import InvalidStone from "./InvalidStone";

it("Construct an Invalid Stone", () => {
    const stone = new InvalidStone();
    expect(stone.isStone()).toBe(false);
    expect(stone.isVacancy()).toBe(false);
});
