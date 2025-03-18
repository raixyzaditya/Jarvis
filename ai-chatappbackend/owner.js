import mongoose from "mongoose";
import bcrypt, { hash } from "bcryptjs";
const RegSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    birth: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

})
RegSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const Register = mongoose.model('Register', RegSchema)
export default Register