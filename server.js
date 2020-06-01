const express = require("express");
const app = express();
const db = require("./config/db");
const PORT = process.env.PORT || 5000;
const methodOverride = require("method-override");

// Connect to MongoDB
db();

app.use(express.json({ extended: false }));
app.use(methodOverride("_method"));

app.use("/api/files", require("./routes/file"));

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
