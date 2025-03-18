import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css"; // ✅ Import core Swiper styles
import "swiper/css/effect-fade"; // ✅ Import effect styles
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const nav = useNavigate()
    const [username, setUsername] = useState("")

    const slides = [
        "Explore the power of Jarvis",
        "Your AI assistant at your service",
        "Ask anything, get instant responses"
    ];

    useEffect(() => {

        const token = localStorage.getItem("token")
        if (token) {
            try {
                const decode = jwtDecode(token)
                setUsername(decode.name)
            } catch (error) {
                console.log("Invalid token", error)
                localStorage.removeItem("token")
            }
        }

    }, [])

    const hasSpoken = useRef(false);
    const speak = (text) => {
        if (!text) return;
        speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance();
        utterance.lang = "en-US";
        utterance.rate = 0.8;
        utterance.pitch = 1;

        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let index = 0;

        const speakNextSentence = () => {
            if (index < sentences.length) {
                utterance.text = sentences[index];
                index++;
                speechSynthesis.speak(utterance);
            }
        };

        utterance.onend = speakNextSentence;
        speechSynthesis.cancel();
        speakNextSentence();
    };
    useEffect(() => {
        if (!hasSpoken.current && username) {
            console.log("✅ Now Speaking:", `Hey ${username}. Jarvis is ready for use`);
            speak(`Hey ${username},Jarvis is ready for use`);
            hasSpoken.current = true;
        }
    }, [username]);

    return (
        <div className="hero-container">
            <Swiper
                modules={[Autoplay]}

                autoplay={{ delay: 3000 }}
                loop
                spaceBetween={50}
                slidesPerView={1}
                className="swiper-container"
            >
                {slides.map((text, index) => (
                    <SwiperSlide key={index}>
                        <h1 className="hero-text">{text}</h1>
                    </SwiperSlide>
                ))}
            </Swiper>
            {username ? (
                <button className="login-button" onClick={() => nav("/chat")}>Get Set</button>
            ) : (<button className="login-button" onClick={() => nav("/login")} >Login to continue</button>)}

        </div>
    );
};

export default Home;
