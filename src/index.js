import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`server running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error");
  });
