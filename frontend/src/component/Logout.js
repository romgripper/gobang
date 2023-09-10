import Cookies from "universal-cookie";
import { useChatContext } from "stream-chat-react";
import Constant from "../core/Constant";

export default function Logout({ setIsAuth }) {
    const cookies = new Cookies();
    const playerName = cookies.get("username");
    const { client } = useChatContext();

    function logout() {
        if (window.confirm("Do you want to logout?")) {
            cookies.remove(Constant.COOKIE_TOKEN);
            cookies.remove(Constant.COOKIE_USER_ID);
            cookies.remove(Constant.COOKIE_HASHED_PASSWORD);
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
