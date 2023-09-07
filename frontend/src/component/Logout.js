import Cookies from "universal-cookie";
import { useChatContext } from "stream-chat-react";

export default function Logout({ setIsAuth }) {
    const cookies = new Cookies();
    const playerName = cookies.get("username");
    const { client } = useChatContext();

    function logout() {
        if (window.confirm("Do you want to logout?")) {
            cookies.remove("token");
            cookies.remove("userId");
            cookies.remove("hashedPassword");
            cookies.remove("channelName");
            cookies.remove("username");
            client.disconnectUser();
            setIsAuth(false);
        }
    }
    return (
        <div className="logout">
            <button onClick={logout}>Logout {playerName}</button>
        </div>
    );
}
