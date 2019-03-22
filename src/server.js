import express from "express";
import routes from "./routes";

const app = express();

app.use(routes);

app.listen(3600, () => console.log(`Server is listening on port 3600`));
module.exports = app;
