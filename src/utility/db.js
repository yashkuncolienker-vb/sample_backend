const mongoose = require("mongoose");
const db = mongoose.connection;

const connectToDb = () => {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  db.on("error", console.error.bind(console, "connection error: "));
  db.on("open", console.error.bind(console, "DB connected: "));
};

module.exports = { connectToDb };
