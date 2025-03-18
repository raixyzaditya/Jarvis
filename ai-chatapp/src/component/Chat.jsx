import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./chat.css";

const Chat = () => {
    const nav = useNavigate();
    const [pop, setPop] = useState(false);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [chat, setChat] = useState([]);
    const [load, setLoad] = useState(false);
    const chatend = useRef(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:5000");

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token)
        if (token) {
            try {
                const decode = jwtDecode(token);
                setUserId(decode.email);
            } catch (error) {
                console.log("Invalid token", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const savedData = localStorage.getItem(`chat_history_${userId}`);
            setChat(savedData ? JSON.parse(savedData) : []);
        }
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        nav("/");
    };

    const speak = (text) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (!socket) return;

        const welcomeText = "Hello! I am Jarvis. How can I assist you today?";
        speak(welcomeText);

        socket.on("receiveMessage", (data) => {
            console.log("Received from server:", data); // Debugging

            if (typeof data !== "object" || !data.content) {
                console.error("Invalid message format:", data);
                return;
            }

            setChat((prev) => {
                const updatedChat = [...prev, data];
                if (userId) {
                    localStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedChat));
                }
                return updatedChat;
            });

            if (data.user === "Jarvis") {
                speak(data.content);
            }
            setLoad(false);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [socket, userId]);

    const scrollBottom = () => {
        setTimeout(() => {
            chatend.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const send = () => {
        if (!socket) {
            console.error("❌ Socket is not initialized.");
            return;
        }

        if (!message.trim()) {
            console.warn("⚠️ Message is empty, not sending.");
            return;
        }

        if (!userId) {
            console.error("❌ User ID is missing, cannot send message.");
            return;
        }

        const userMessage = String(message);
        console.log("🚀 Sending message to server:", userMessage);

        // Add a log before emitting the event
        socket.emit("sendMessage", userMessage);
        console.log("✅ Message emitted successfully!");

        setChat((prev) => {
            const updatedChat = [...prev, { user: "You", content: userMessage }];
            localStorage.setItem(`chat_history_${userId}`, JSON.stringify(updatedChat));
            return updatedChat;
        });

        setMessage(""); // Clear input field
        setLoad(true);
        scrollBottom();
    };




    return (
        <div className="chat-container">
            <h2 className="chat-title">Chat with Jarvis 🤖</h2>
            <div className="chat-box">
                {chat.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.user === "You" ? "user-message" : "ai-message"}`}
                    >
                        <strong>{msg.user}:</strong> {msg.content}
                    </div>
                ))}
                {load && (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <span className="typing">Jarvis is typing...</span>
                    </div>
                )}
                <div ref={chatend}></div>
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask anything..."
                    className="chat-input"
                />

                <button onClick={() => {
                    console.log("🖱️ Send button clicked! Calling send()...");
                    send();
                }} className="send-button">Send</button>

            </div>

            <button className="logout-btn" onClick={() => setPop(true)}>Logout</button>

            {pop && (
                <div className="overlay">
                    <div className="logout-popup">
                        <h3>Are you sure you want to logout?</h3>
                        <div className="popup-buttons">
                            <button onClick={handleLogout} className="confirm-btn">Logout</button>
                            <button onClick={() => setPop(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
