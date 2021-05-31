const express = require("express");
const router = require("./routes");
const pages = require("./routes/pages");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(pages);
app.use(router);

app.listen(5001, () => console.log("Server started on port 5001"));
