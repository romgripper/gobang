import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend/build"));

const apiKey = "7mcca6yx3r9d";
const serverClient = StreamChat.getInstance(apiKey, process.env.API_SECRET);

app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createToken(userId);
        res.json({ token, userId, username, hashedPassword });
    } catch (error) {
        res.json(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const { users } = await serverClient.queryUsers({ name: username });
        if (users.length === 0) return res.json({ message: "User not found" });

        const token = serverClient.createToken(users[0].id);
        const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);

        if (passwordMatch) {
            res.json({
                token,
                username,
                userId: users[0].id
            });
        } else {
            res.json({ error: "User name or password is not correct" });
        }
    } catch (error) {
        res.json(error);
    }
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
