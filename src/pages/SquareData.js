export class PlayerSquare {
    #isBlack;
    #isIn5 = false;
    #isLatestMove = false;

    constructor(isBlack, isIn5 = false, isLatestMove = false) {
        this.#isBlack = isBlack; // black or white
        this.#isIn5 = isIn5;
        this.#isLatestMove = isLatestMove;
    }

    isMarkedByPlayer() {
        return true;
    }

    isEmpty() {
        return false;
    }

    showWarning() {
        return false;
    }

    setShowWarning() {}

    isBlack() {
        return this.#isBlack;
    }

    getPlayer() {
        return this.#isBlack ? "X" : "O";
    }

    isIn5() {
        return this.#isIn5;
    }

    setIn5() {
        this.#isIn5 = true;
    }

    isLatestMove() {
        return this.#isLatestMove;
    }

    setLatestMove(isLatestMove) {
        this.#isLatestMove = isLatestMove;
    }

    clone() {
        return new PlayerSquare(this.#isBlack, this.#isIn5, this.#isLatestMove);
    }
}

export class EmptySquare {
    #showWarning = false;

    constructor(showWarning = false) {
        this.#showWarning = showWarning;
    }

    isMarkedByPlayer() {
        return false;
    }

    isEmpty() {
        return true;
    }

    showWarning() {
        return this.#showWarning;
    }

    setShowWarning(showWarning) {
        this.#showWarning = showWarning;
    }

    isLatestMove() {
        return false;
    }

    getPlayer() {
        return null;
    }

    isIn5() {
        return false;
    }

    clone() {
        return new EmptySquare(this.#showWarning);
    }
}

export class VirtualSquare {
    isMarkedByPlayer() {
        return false;
    }

    isEmpty() {
        return false;
    }

    showWarning() {
        return false;
    }
}
