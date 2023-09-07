import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { Channel } from "stream-chat-react";
import Cookies from "universal-cookie";
import Login from "./component/Login";
import Header from "./component/Status";
import Footer from "./component/Footer";
import JoinGame from "./component/JoinGame";
import UiGame from "./component/UiGame";
import UiBoard from "./component/UiBoard";

import "./App.css";
import Logout from "./component/Logout";
import LeaveGame from "./component/LeaveGame";

let gameName = new URLSearchParams(window.location.search).get("game") ?? "gobang";
gameName = gameName.toLowerCase();
if (gameName !== "go") {
    gameName = "gobang";
}

const cookies = new Cookies();
const client = StreamChat.getInstance("7mcca6yx3r9d");

export default function App() {
    const token = cookies.get("token");
    const [isAuth, setIsAuth] = useState(token ? true : false);
    const [playersJoined, setPlayersJoined] = useState(false);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        if (token) {
            client
                .connectUser(
                    {
                        id: cookies.get("userId"),
                        name: cookies.get("username"),
                        hashedPassword: cookies.get("hashedPassword")
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
            {playersJoined && channel ? (
                <Channel channel={channel}>
                    <UiGame gameName={gameName}>
                        <Header />
                        <UiBoard />
                        <Footer />
                    </UiGame>
                    <LeaveGame setChannel={setChannel} />
                </Channel>
            ) : (
                <JoinGame channel={channel} setChannel={setChannel} setPlayersJoined={setPlayersJoined} />
            )}
            <Logout setIsAuth={setIsAuth} />
        </Chat>
    );
}
