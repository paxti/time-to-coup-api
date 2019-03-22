import express from "express";
const app = express();
app.listen(3600, () => console.log(`Server is listening on port 3600`));
module.exports = app;
