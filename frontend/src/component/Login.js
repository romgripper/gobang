import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import "./Login.css";

function Login({ setIsAuth }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const cookies = new Cookies();
    function login() {
        Axios.post("/login", {
            username,
            password
        })
            .then((res) => {
                const { username, token, userId } = res.data;
                if (token) {
                    cookies.set("token", token);
                    cookies.set("userId", userId);
                    cookies.set("username", username);
                    setIsAuth(true);
                } else {
                    alert("User name or password is incorrect");
                }
            })
            .catch(console.error);
    }
    return (
        <div className="login">
            <label> Login</label>

            <input
                placeholder="Username"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <input
                placeholder="Password"
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />
            <button onClick={login}> Login</button>
        </div>
    );
}

export default Login;
