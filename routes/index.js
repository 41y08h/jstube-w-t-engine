const router = require("express").Router();
const home = require("./home");

router.use("/", home);
module.exports = router;
