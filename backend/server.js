const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DB_URL;
if (!DB) {
  console.error("❌ DB_URL is not defined in config.env");
  process.exit(1);
}

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ DB connection successful!"))
  .catch((err) => {
    console.error("❌ DB connection error:", err.name, err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
