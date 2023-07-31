export class PlayerSquare {
    #isBlack;
    #isIn5 = false;
    #isCurrentMove = false;

    constructor(isBlack) {
        this.#isBlack = isBlack; // black or white
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
}

export class EmptySquare {
    #showWarning = false;

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

export function getPlayer(isBlack) {
    return isBlack ? "X" : "O";
}
