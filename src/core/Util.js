import Vacancy from "./Vacancy";

export default class Utils {
    static COORDINATE_CALCULATORS = [
        ([row, column], n) => [row, column + n], // row
        ([row, column], n) => [row + n, column], // column
        ([row, column], n) => [row + n, column + n], // diagonal 1
        ([row, column], n) => [row + n, column - n] // diagonal 2
    ];

    static getStone(stones, [row, column]) {
        return stones[row][column] || Vacancy.getInstance();
    }

    static getRow(stones, row) {
        return stones[row];
    }

    static setStone(stones, [row, column], Stone) {
        stones[row][column] = Stone;
    }
}
