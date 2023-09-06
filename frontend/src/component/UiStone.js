import { useBoard, useGameContext, useDispatch } from "./UiGame";
import { useChannelStateContext } from "stream-chat-react";

export default function UiStone({ row, column, size }) {
    const stone = useBoard().getStone([row, column]);
    const dispatch = useDispatch();
    const game = useGameContext();
    const { channel } = useChannelStateContext();

    let className = "square";
    if (stone.isStone()) {
        className += stone.isBlack() ? " black" : " white";
        className += stone.isBlink() ? " blink" : "";
    }

    async function handleClick() {
        const action = game.createPlaceStoneAction([row, column]);
        if (channel) await channel.sendEvent(action); // don't send event if playing locally where channel is null
        dispatch(action);
    }

    return <button className={className} style={{ width: size, height: size }} onClick={handleClick} />;
}
