const router = require("express").Router();
const subscribers = require("./subscribers");
const ratings = require("./ratings");

router.use("/subscribers", subscribers);
router.use("/ratings", ratings);

module.exports = router;
