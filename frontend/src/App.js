import UiGame from "./component/UiGame";
import UiBoard from "./component/UiBoard";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import Login from "./component/Login";
import Header from "./component/Header";
import Footer from "./component/Footer";
import JoinGame from "./component/JoinGame";

import "./App.css";

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
            <UiGame gameName={gameName}>
                {playersJoined ? (
                    <>
                        <Header />
                        <UiBoard />
                        <Footer />
                    </>
                ) : (
                    <JoinGame setIsAuth={setIsAuth} setPlayersJoined={setPlayersJoined} />
                )}
            </UiGame>
        </Chat>
    );
}
