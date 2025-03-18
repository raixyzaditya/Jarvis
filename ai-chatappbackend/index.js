import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import dotenv from "dotenv";
import axios from "axios";
import Register from "./owner.js";
import { json } from "stream/consumers";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import cors from "cors"
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // ✅ Allow frontend to connect
        methods: ["GET", "POST"]
    }
});
app.use(cors())
app.use(express.json())



mongoose.connect("mongodb://localhost:27017/msg_store")
    .then(() => console.log("Connected to db jarvis"))
    .catch((err) => console.log("Error in connection:", err));



app.use(session({
    secret: "owner_data",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 6000 * 60
    }

}))
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", async (data) => {
        const apikey = "b8b64e589ba230cbf7564beac11baa6cdd9119edfb2d3c0fa7d19b5fa0d379af";
        console.log("Received Message from Client:", data);
        console.log("Received Message from Client:", data);


        const userMessage = String(data);

        try {
            const aiResponse = await axios.post(
                "https://api.together.xyz/v1/chat/completions",
                {
                    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                    messages: [{ role: "user", content: userMessage }]
                },
                {
                    headers: {
                        Authorization: `Bearer ${apikey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Full AI Response:", JSON.stringify(aiResponse.data, null, 2));

            if (!aiResponse.data.choices || aiResponse.data.choices.length === 0) {
                throw new Error("No response from AI");
            }

            const reply = aiResponse.data.choices[0].message.content;

            socket.emit("receiveMessage", { user: "Jarvis", content: reply });
        } catch (error) {
            console.error("AI API Error:", error.response?.data || error.message);
            socket.emit("receiveMessage", { user: "Jarvis", content: "Sorry, an error occurred. Please try again later." });
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});


app.post("/register/yourself", async (req, res) => {
    try {
        const { body } = req
        console.log(body)
        const adduser = new Register(req.body)
        await adduser.save()
        res.status(200).json({ message: "User added successfully" })
    } catch (error) {
        res.status(500).json({ error: `Error is registration ${error}` })
    }

})
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Email or Password" })
        }

        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        return res.status(500).json({ error: "Server Error" });
    }
});


server.listen(5000, () => console.log("Hey, I am Jarvis..."));
