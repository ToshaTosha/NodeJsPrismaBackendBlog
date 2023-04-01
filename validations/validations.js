import { body } from "express-validator";

export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("name", "Укажите имя").isLength({ min: 5 }),
  body("avatarUrl", "Ошибка при загрузке изображения").optional().isURL(),
];
