import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const nav = useNavigate()
    const [form, setForm] = useState({ "name": "", "email": "", "phone": "", "birth": "", "country": "", "password": "" })
    const [done, setDone] = useState(false)
    const [err, setErr] = useState("")
    const change = (e) => {
        const { name, value } = e.target
        setForm((pre) => ({
            ...pre,
            [name]: value
        }))
    }
    const submit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.phone || !form.birth || !form.country || !form.password) {
            setErr("All fields are required!");
            return;
        }
        const user = await fetch("http://localhost:5000/register/yourself", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
        const response = await user.json()
        if (response.error) {
            setErr(response.error)
            return
        }
        setDone(true)
    }

    return (
        <div className="jarvis-container">
            <h2 className="jarvis-title">J.A.R.V.I.S Registration</h2>
            {err && <p className="error-message">{err}</p>}
            <div className="input-group">
                <label>Name:</label>
                <input type="text" name="name" value={form.name} onChange={change} />
            </div>

            <div className="input-group">
                <label>Email Address:</label>
                <input type="email" name="email" value={form.email} onChange={change} />
            </div>

            <div className="input-group">
                <label>Contact No:</label>
                <input type="text" name="phone" value={form.phone} onChange={change} />
            </div>

            <div className="input-group">
                <label>Date of Birth:</label>
                <input type="date" name="birth" value={form.birth} onChange={change} />
            </div>

            <div className="input-group">
                <label>Country:</label>
                <input type="text" name="country" value={form.country} onChange={change} />
            </div>

            <div className="input-group">
                <label>Password:</label>
                <input type="password" name="password" value={form.password} placeholder="Choose a strong password..." onChange={change} />
            </div>

            <button className="jarvis-btn" onClick={submit}>Submit</button>

            {done && (
                <div className="overlay">
                    <div className="success-message">
                        <p>You are successfully registered</p>
                        <button className="jarvis-btn" onClick={() => nav("/login")}>Now login</button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Signup