import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import bookRoute from "./routes/bookRoute.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import userRoute from "./routes/userRoute.js";

const app = express();

// middleware for parsing request body
app.use(express.json());

// middlesware for handling CORS policy
app.use(
  cors({
    origin: "http://localhost:5555",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
)

// homepage
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to MERN Stack Tutorial");
});

// routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use('/books', bookRoute);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to the database");

    // only run server when the connection is successful
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
