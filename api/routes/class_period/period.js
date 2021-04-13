const express = require("express")

const router = express.Router();

router.get("/retrieve-all", (req, res) => {
  try {
      const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);

      // TODO

      res.sendStatus(200);

  } catch (err) {
      console.log(err);
      error.sendError(res, 404, "huh");
  }
})

module.exports = router;