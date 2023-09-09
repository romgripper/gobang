import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { Channel } from "stream-chat-react";
import Cookies from "universal-cookie";
import Login from "./component/Login";
import Status from "./component/Status";
import AutoPlacement from "./component/AutoPlacement";
import JoinGame from "./component/JoinGame";
import Game from "./component/GameContext";
import UiBoard from "./component/UiBoard";

import "./App.css";
import Logout from "./component/Logout";
import LeaveGame from "./component/LeaveGame";
import Constant from "./core/Constant";
import PersistUtil from "./core/PersistUtil";

let gameName = new URLSearchParams(window.location.search).get("game") ?? "gobang";
gameName = gameName.toLowerCase();
if (gameName !== "go") {
    gameName = "gobang";
}

const cookies = new Cookies();
const client = StreamChat.getInstance("7mcca6yx3r9d");

export default function App() {
    const token = cookies.get(Constant.COOKIE_TOKEN);
    const [isAuth, setIsAuth] = useState(token ? true : false);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        if (token) {
            client
                .connectUser(
                    {
                        id: cookies.get(Constant.COOKIE_USER_ID),
                        name: PersistUtil.getStoredUserName,
                        hashedPassword: cookies.get(Constant.COOKIE_HASHED_PASSWORD)
                    },
                    token
                )
                .then(() => {});
        }
    }, [token]);

    useEffect(() => {
        document.title = gameName.charAt(0).toUpperCase() + gameName.slice(1);
    }, []);

    if (!isAuth) return <Login setIsAuth={setIsAuth} />;

    return (
        <Chat client={client}>
            {channel ? (
                <Channel channel={channel}>
                    <Game gameName={gameName}>
                        <Status />
                        <UiBoard />
                        <AutoPlacement />
                        <LeaveGame setChannel={setChannel} />
                    </Game>
                </Channel>
            ) : (
                <JoinGame setChannel={setChannel} />
            )}
            <Logout setIsAuth={setIsAuth} />
        </Chat>
    );
}
