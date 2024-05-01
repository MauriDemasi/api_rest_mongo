const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { config } = require("dotenv");

config();

const { bookRouter, getBook } = require("./routes/book.routes");

//Middleware de express
const app = express();
app.use(bodyParser.json());

//Conectar a la base de datos de Mongoose
mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;

app.use("/books", bookRouter);

app.get(
  "/",
  ({ req, res } = res.status(200).json({
    message: "Hello World",
  }))
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
