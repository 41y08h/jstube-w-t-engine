const router = require("express").Router();
const db = require("../lib/db");

router.get("/", (req, res) => {
  const { rows: videos } = db.query(`select * from "Video"`);
  res.render("home", { videos });
});

module.export = router;
