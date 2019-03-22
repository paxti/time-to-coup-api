import express from "express";
import roles from "./roles";

var router = express.Router();
router.use("/roles", roles);

module.exports = router;
