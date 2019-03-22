import express from "express";

var router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ tags: "Hello world" });
});

module.exports = router;
