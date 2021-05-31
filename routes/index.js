const router = require("express").Router();
const subscribers = require("./subscribers");

router.use("/subscribers", subscribers);

module.exports = router;
