import { useChatContext } from "stream-chat-react";
import { useState } from "react";
import Cookies from "universal-cookie";

import "./JoinGame.css";

export default function JoinGame({ channel, setChannel, setPlayersJoined }) {
    const { client } = useChatContext();
    const cookies = new Cookies();
    const playerName = cookies.get("username");

    const [rivalUsername, setRivalUsername] = useState("");

    async function createChannel() {
        if (rivalUsername === playerName) {
            alert("You cannot play against yourself!");
            return;
        }

        const response = await client.queryUsers({ name: { $eq: rivalUsername } });
        if (response.users.length === 0) {
            alert("User not found");
            return;
        }

        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id]
        });

        await newChannel.watch();
        setChannel(newChannel);
    }

    if (channel) {
        setPlayersJoined(channel.state.watcher_count === 2);
        channel.on("user.watching.start", (event) => {
            setPlayersJoined(event.watcher_count === 2);
        });
    }

    async function leaveGame() {
        await channel.stopWatching();
        setChannel(null);
    }

    return (
        <div className="joinGame">
            {channel ? (
                <>
                    <p>Waiting for {rivalUsername} to join...</p>
                    <button onClick={leaveGame}>Leave Game</button>
                </>
            ) : (
                <>
                    <h4>Create Game</h4>
                    <input placeholder="Rival username" onChange={(event) => setRivalUsername(event.target.value)} />
                    <button onClick={createChannel}>Join/Start Game</button>
                </>
            )}
        </div>
    );
}
