const express = require("express")

const csvRouter = require("./csv"); 
const studentsRouter = require("./students");
const periodRouter = require("./period");

const router = express.Router();

router.use("/csv", csvRouter); 
router.use("/students", studentsRouter);
router.use("/", periodRouter);

module.exports = router;