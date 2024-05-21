// server/config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dotenv.config();
MONGO_URI =
  "mongodb+srv://evansnyamai98:DbSNifX03fnusbnU@cluster0.tujufn8.mongodb.net/colabtool?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log("This is a stupid error");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
