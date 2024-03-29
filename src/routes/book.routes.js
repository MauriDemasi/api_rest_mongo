const express = require("express");
const bookRouter = express.Router();
const Book = require("../models/book.models");

//MIDDLEWARE:
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: "El id del libro no es valido" });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "El libro no existe" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.book = book;
  next();
};

//Obtener todos los libros
bookRouter.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("GET ALL", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Crear un nuevo libro
bookRouter.post("/", async (req, res) => {
  const { title, author, genre, published_date } = req.body;
  if (!(title || author || genre || published_date)) {
    return res.status(400).json({
      message: "Faltan datos",
    });
  }

  const book = new Book({
    title,
    author,
    genre,
    published_date,
  });

  try {
    const newBook = await book.save();
    console.log("POST", newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Obtener un libro
bookRouter.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});

//Actualizar un libro
bookRouter.put("/:id", getBook, async (req, res) => {
  try {
    const updatedBook = await res.book;
    updatedBook.title = req.body.title || updatedBook.title;
    updatedBook.author = req.body.author || updatedBook.author;
    updatedBook.genre = req.body.genre || updatedBook.genre;
    updatedBook.published_date =
      req.body.published_date || updatedBook.published_date;

    await updatedBook.save();

    console.log("PUT", updatedBook);
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Patch
bookRouter.patch("/:id", getBook, async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genre &&
    !req.body.published_date
  ) {
    return res.status(400).json({
      message: "Al menos uno de estos campos deben ser enviados",
    });
  }

  try {
    const updatedBook = await res.book;
    updatedBook.title = req.body.title || updatedBook.title;
    updatedBook.author = req.body.author || updatedBook.author;
    updatedBook.genre = req.body.genre || updatedBook.genre;
    updatedBook.published_date =
      req.body.published_date || updatedBook.published_date;

    await updatedBook.save();

    console.log("PUT", updatedBook);
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Eliminar un libro
bookRouter.delete("/:id", getBook, async (req, res) => {
  try {
    const deletedBook = await res.book;
    await deletedBook.deleteOne({
      _id: deletedBook._id,
    });

    console.log("DELETE", deletedBook);
    res.json(`El libro ${deletedBook.title} fue eliminado correctamente. `);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = {
  bookRouter,
};
