const express = require("express")

const csvRouter = require("./csv"); 
const studentsRouter = require("./students");

const router = express.Router();

router.use("/csv", csvRouter); 
router.use("/students", studentsRouter);

module.exports = router;