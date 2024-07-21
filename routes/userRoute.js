import express from "express";
import { User } from "../models/userModel.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// get userinformation
router.get("/profile", auth, async (request, response) => {
    try {
        response.status(201).send({message: "This is a protected route", userId: request.user, requestBody: request.body});
    } catch(error){
        response.status(401).send({message: "Token is not valid."});
    }
})

export default router;