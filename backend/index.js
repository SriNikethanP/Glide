import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5000, () => {
  console.log(`Server is running at port 5000`);
});
