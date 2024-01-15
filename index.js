require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const videofamily = require("./routes/videos");
const port = process.env.PORT;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use("/", videofamily);

app.use(express.static('images'))

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
