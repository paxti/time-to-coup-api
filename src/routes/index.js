import express from "express";
import api from "../routes/api";

let router = express.Router();

router.use("/api", api);

module.exports = router;
