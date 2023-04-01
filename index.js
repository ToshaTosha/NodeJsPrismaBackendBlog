import express from "express";
import { PrismaClient } from "@prisma/client";
import postRoute from "./routes/posts.js";
import userRoute from "./routes/user.js";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const prisma = new PrismaClient();
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});

app.delete("/delete-file/", (req, res) => {
  const fileToDelete = req.body.imageURL;
  console.log(req.body);

  // Check if the file exists
  fs.access(fileToDelete, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }
    // Delete the file
    fs.unlink(fileToDelete, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send("File deleted successfully");
    });
  });
});

app.use("/post", postRoute);
app.use("/user", userRoute);

app.listen(8000, () => {
  console.log("server OK");
});
