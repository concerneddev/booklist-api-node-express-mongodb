import mongoose from "mongoose";
import { Book } from "./bookModel.js";
import { User } from "./userModel.js";

const userBookSchema = mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["reading", "finished", "toberead"],
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export const UserBook = mongoose.model("UserBook", userBookSchema);