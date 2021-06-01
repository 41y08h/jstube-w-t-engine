const router = require("express").Router();
const subscribers = require("./subscribers");
const ratings = require("./ratings");
const comments = require("./comments");

router.use("/subscribers", subscribers);
router.use("/ratings", ratings);
router.use("/comments", comments);

module.exports = router;
