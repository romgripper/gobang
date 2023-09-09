import { useChatContext } from "stream-chat-react";
import { useState } from "react";
import Cookies from "universal-cookie";
import Constant from "./Constant";

export default function JoinGame({ setChannel }) {
    const { client } = useChatContext();
    const cookies = new Cookies();
    const playerName = cookies.get(Constant.COOKIE_USERNAME);

    const [rivalUsername, setRivalUsername] = useState(cookies.get(Constant.COOKIE_RIVAL));

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

        cookies.set(Constant.COOKIE_RIVAL, rivalUsername);
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
                Value={rivalUsername}
                onChange={(event) => setRivalUsername(event.target.value)}
            />
            <button onClick={createChannel}>Join/Start Game</button>
        </div>
    );
}
