import Vacancy from "./Vacancy";

it("Construct a vacancy", () => {
    const stone = new Vacancy();
    expect(stone.isStone()).toBe(false);
    expect(stone.isVacancy()).toBe(true);
});
