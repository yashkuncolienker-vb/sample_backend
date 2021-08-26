require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

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
app.use(cors());
app.use(router);
const options = {
  customCss: `
    .swagger-ui .topbar {
      background-color: #ffffff;
      padding: 10px 0;
    }
    .topbar-wrapper .link:after {
      content: url(${process.env.LOGO_URL});
      width: 240px !important;
      display: flex;
    }
    .topbar-wrapper img[alt="Swagger UI"], .topbar-wrapper span {
    visibility: collapse;
    display: none !important;
    }
  `,
};
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.listen(port, () => {
  console.log(`app listening on port ${port} !`);
});
module.exports = app;
