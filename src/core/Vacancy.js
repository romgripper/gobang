export default class Vacancy {
    static #instance;

    isStone() {
        return false;
    }

    isVacancy() {
        return true;
    }

    static getInstance() {
        if (!Vacancy.#instance) {
            Vacancy.#instance = new Vacancy();
        }
        return Vacancy.#instance;
    }
}
