import express from "express";
import { Book } from "../models/bookModel.js";
import auth from "../middleware/auth.js";
import { User } from "../models/userModel.js";
import { UserBook } from "../models/userBookModel.js";

const router = express.Router();

// route to save a new book
router.post("/", auth, async (request, response) => {
  try {
    // get userId
    if(!request.user) {
      return response.status(401).send({message: "Access denied."});
    } 

    const userId = request.user;
    const user = await User.findById(userId);
    if(!user) {
      return response.status(401).send({message: "Register first."});
    }

    // validate
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear||
      !request.body.status
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear, status",
      });
    }

    // post req changes
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };
    const book = await Book.create(newBook);

    const newUserBook = {
      createdBy: user,
      status: request.body.status,
      book: book
    }
    const userBook = await UserBook.create(newUserBook);
    const createdUserBook = {
      createdBy: user.username,
      status: userBook.status,
      book: book
    }
    return response.status(201).send(createdUserBook);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// get all books created by a user
router.get("/", auth, async (request, response) => {
  try {
    if(!request.user) {
      return response.status(401).send({message: "Access denied."});
    } 

    const userId = request.user;
    const user = await User.findById(userId);
    if(!user) {
      return response.status(401).send({message: "Register first."});
    }

    const books = await UserBook.find({createdBy: userId});
    const book = await Book.find({id: books.book});
    return response.status(200).json({
      count: books.length,
      data: book,
    });

  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error.message });
  }
});

// get one book by id
// !! CAN BE OPTIMISED !!
router.get("/:id", auth, async (request, response) => {
  try {
    if(!request.user) {
      return response.status(401).send({message: "Access denied."});
    } 

    const userId = request.user;
    const user = await User.findById(userId);
    if(!user) {
      return response.status(401).send({message: "Register first."});
    }

    const { id } = request.params;
    const userBook = await UserBook.find({createdBy: userId});
    const booksCreatedByUser = await Book.find({id: userBook.book});

    function findObjectById(data, id) {
      return data.find(obj => obj.id === id);
    }
    const book = findObjectById(booksCreatedByUser, id)
    if(!book) {
      return response(401).send({message: "No book found."});
    }

    return response.status(200).send(book);
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error.message });
  }
});

// updating a book
router.put("/:id", auth, async (request, response) => {
  try {
    if(!request.user) {
      return response.status(401).send({message: "Access denied."});
    } 

    const userId = request.user;
    const user = await User.findById(userId);
    if(!user) {
      return response.status(401).send({message: "Register first."});
    }
    // validate
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = request.params;
    const userBook = await UserBook.find({createdBy: userId});
    const booksCreatedByUser = await Book.find({id: userBook.book});

    function findObjectById(data, id) {
      return data.find(obj => obj.id === id);
    }
    const book = findObjectById(booksCreatedByUser, id)
    if(!book) {
      return response(401).send({message: "No book found."});
    }

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Book not found." });
    }

    return response.status(200).json({ message: "Book updated successfully." });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error.message });
  }
});

// deleting a book
// !!! NOT REWRITTEN FOR DELETING WITH AUTH !!!
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;