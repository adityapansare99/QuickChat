import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./DB/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.log("Something Went Wrong..",err)
  });