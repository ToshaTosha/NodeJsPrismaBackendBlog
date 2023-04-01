import express from "express";
var router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { verifyToken } from "../middleware/checkAuth.js";

router.post("/post", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.userId,
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.get("/post", async (res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, favoritedBy: true },
    });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    const post = await prisma.post.findUnique({
      where: { id: Number(userId) },
      include: { author: true, favoritedBy: true },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  let userId = req.params.id;
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(userId) },
      data: {
        title: title,
        content: content,
        authorId: authorId,
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  let userId = req.params.id;
  try {
    await prisma.post.delete({
      where: { id: Number(userId) },
    });
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.put("/favoritedBy/:id", verifyToken, async (req, res) => {
  let postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: {
        favoritedBy: { set: [{ id: userId }] },
      },
    });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

export default router;
