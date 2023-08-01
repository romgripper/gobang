export class PlayerSquare {
    #isBlack;
    #isIn5 = false;
    #isCurrentMove = false;

    constructor(isBlack, isIn5 = false, isCurrentMove = false) {
        this.#isBlack = isBlack; // black or white
        this.#isIn5 = isIn5;
        this.#isCurrentMove = isCurrentMove;
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

    isCurrentMove() {
        return this.#isCurrentMove;
    }

    setCurrentMove(isCurrentMove) {
        this.#isCurrentMove = isCurrentMove;
    }

    clone() {
        return new PlayerSquare(this.#isBlack, this.#isIn5, this.#isCurrentMove);
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

    isCurrentMove() {
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

    clone() {
        return new VirtualSquare();
    }
}

export function getPlayer(isBlack) {
    return isBlack ? "X" : "O";
}
