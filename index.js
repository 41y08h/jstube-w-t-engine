const express = require("express");

const app = express();
app.set("view engine", "ejs");

app.listen(5001, () => console.log("Server started on port 5000"));
