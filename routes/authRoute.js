import express, { request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.SECRET_KEY;

// register
router.post("/register", async(request, response) => {
    try {
        // validation
        if (
            !request.body.username ||
            !request.body.email ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "Send all required fields: username, email, password",
            });
        }

        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;

        // unique username
        let user = await User.findOne({username});
        if(user){
            return response.status(400).send({message: "User already exists."});
        }

        // unique email
        user = await User.findOne({email});
        if(user){
            return response.status(400).send({message: "User already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            username, 
            email,
            password: hashedPassword
        });
        response.status(201).send({message: "User registered successfully."});

    } catch(error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// login using username
router.post("/login", async(request, response) => {
    try{
        // validation
        if (
            !request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "Send all required fields: username, password",
            });
        }

        const username = request.body.username;
        const password = request.body.password;

        // check if the user exists
        const user = await User.findOne({username});
        if (!user) {
            return response.status(400).send({message: "Invalid credentials. "});
        }

        // compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(400).send({message: "Invalid credentials. "});
        }

        // generate JWT
        const payload = { userId: user._id};
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });

        response.send({ token });
    } catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// logout
router.post('/logout', (req, res) => {
    res.json({ msg: 'User logged out' });

    // delete the generated JWT from the client side
    // that logic to be written in the frontend application
});

export default router;