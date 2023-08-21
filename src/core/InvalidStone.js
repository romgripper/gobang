// Represent values whose coordinates are out of bound
export default class InvalidStone {
    static #instance;

    isStone() {
        return false;
    }

    isVacancy() {
        return false;
    }

    static getInstance() {
        if (!InvalidStone.#instance) {
            InvalidStone.#instance = new InvalidStone();
        }
        return InvalidStone.#instance;
    }
}
