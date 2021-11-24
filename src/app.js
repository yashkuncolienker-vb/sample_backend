require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { connectToDb } = require("./utility/db");
const constants = require("./utility/constant");

const router = require("./routes");
const app = express();
const port = process.env.PORT || 3000;
const swaggerFile = require("../public/api-docs/swagger-output.json");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors(constants.CORS_OPTIONS));
app.use(router);
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, constants.SWAGER_OPTIONS)
);
app.listen(port, async () => {
  await connectToDb();
});
module.exports = app;
