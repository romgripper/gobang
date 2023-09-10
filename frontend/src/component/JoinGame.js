import { useChatContext } from "stream-chat-react";
import { useState } from "react";
import PersistUtil from "../core/PersistUtil";

export default function JoinGame({ setChannel }) {
    const { client } = useChatContext();
    const playerName = PersistUtil.getUsername();

    const [rivalUsername, setRivalUsername] = useState(PersistUtil.getRival());

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

        PersistUtil.persistRival(rivalUsername);
        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id]
        });

        await newChannel.watch();
        setChannel(newChannel);
    }

    return (
        <div className="joinGame">
            <h4>Create Game</h4>
            <input
                placeholder="Rival username"
                value={rivalUsername}
                onChange={(event) => setRivalUsername(event.target.value)}
            />
            <button onClick={createChannel}>Join/Start Game</button>
        </div>
    );
}
