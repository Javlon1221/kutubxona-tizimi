const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 👤 O‘quvchilar CRUD
router.post("/", userController.createUser);      // ➕ Yangi o‘quvchi
router.get("/", userController.getUsers);         // 📋 O‘quvchilar ro‘yxati
router.get("/:id", userController.getUserById);   // 🔍 Bitta o‘quvchi
router.put("/:id", userController.updateUser);    // ✏️ O‘quvchini yangilash
router.delete("/:id", userController.deleteUser); // ❌ O‘quvchini o‘chirish

module.exports = router;
