import express from "express";
var router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import {
  loginValidator,
  registerValidator,
} from "../validations/validations.js";
import { verifyToken } from "../middleware/checkAuth.js";

router.post("/register", registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const { email, name, avatarUrl } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        name,
        avatarUrl,
      },
    });

    const token = jwt.sign(
      {
        _id: user.id,
      },
      "secretkey",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.post("/login", loginValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user.id,
      },
      "secretkey",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { writtenPosts: true, favoritePosts: true },
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
});

export default router;
