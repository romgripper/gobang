import { useChannelStateContext } from "stream-chat-react";

export default function LeaveGame({ setChannel }) {
    const { channel } = useChannelStateContext();

    async function leaveGame() {
        await channel.stopWatching();
        setChannel(null);
    }

    return (
        <div className="leaveGame">
            <button onClick={leaveGame}>Leave Game</button>
        </div>
    );
}
