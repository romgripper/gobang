import { useBoard, useGameContext, useDispatch } from "./UiGame";

export default function UiStone({ row, column, size }) {
    const stone = useBoard().getStone([row, column]);
    const dispatch = useDispatch();
    const game = useGameContext();

    let className = "square";
    if (stone.isStone()) {
        className += stone.isBlack() ? " black" : " white";
        className += stone.isBlink() ? " blink" : "";
    }

    return (
        <button
            className={className}
            style={{ width: size, height: size }}
            onClick={() => dispatch(game.createPlaceStoneAction([row, column]))}
        />
    );
}
