
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const Login = () => {
    const nav = useNavigate()
    const [form, setForm] = useState({ "email": "", "password": "" })
    const [err, setError] = useState("")
    const [done, setDone] = useState(false)
    const [username, setUsername] = useState("")
    const change = (e) => {
        const { name, value } = e.target
        setForm((pre) => ({
            ...pre,
            [name]: value
        }))
    }
    const submit = async (e) => {
        e.preventDefault()
        // if (!form.email || !form.password) {
        //     setError("Invalid Email or Password")
        //     return
        // }
        const user = await fetch("http://localhost:5000/login", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const res = await user.json()
        if (res.error) {
            setError(res.error)
            return
        }
        localStorage.setItem("token", res.token)
        const token = localStorage.getItem("token")
        if (token) {
            const decode = jwtDecode(token)
            setUsername(decode.name)
            setDone(true)
        }

    }
    return (
        <div className="jarvis-container">
            <h2 className="jarvis-title">J.A.R.V.I.S Login System</h2>
            {err && <p className="error-message">{err}</p>}
            <div className="input-group">
                <label>Email:</label>
                <input type="email" name="email" value={form.email} onChange={change} />
            </div>

            <div className="input-group">
                <label>Password:</label>
                <input type="password" name="password" value={form.password} onChange={change} />
            </div>

            <button className="jarvis-btn" onClick={submit}>Login</button>

            <div className="signup-container">
                <button className="signup-btn" onClick={() => nav("/signup")}>Sign Up</button>
            </div>
            {done && (
                <div className="overlay">
                    <div className="success-message">
                        <p>Welcome {username}. This is Jarvis</p>
                        <button className="jarvis-btn" onClick={() => nav("/")}>This way</button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Login