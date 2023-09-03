import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import "./SignUp.css";

function SignUp({ setIsAuth }) {
    const cookies = new Cookies();
    const [user, setUser] = useState(null);

    const signUp = () => {
        Axios.post("/signup", user).then((res) => {
            const { token, userId, username, hashedPassword } = res.data;
            if (token) {
                cookies.set("token", token);
                cookies.set("userId", userId);
                cookies.set("username", username);
                cookies.set("hashedPassword", hashedPassword);
                setIsAuth(true);
            }
        });
    };
    return (
        <div className="signUp">
            <label> Sign Up</label>
            <input
                placeholder="Username"
                onChange={(event) => {
                    setUser({ ...user, username: event.target.value });
                }}
            />
            <input
                placeholder="Password"
                type="password"
                onChange={(event) => {
                    setUser({ ...user, password: event.target.value });
                }}
            />
            <button onClick={signUp}> Sign Up</button>
        </div>
    );
}

export default SignUp;
