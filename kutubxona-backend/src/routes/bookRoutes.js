const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// 📚 Kitoblar CRUD
router.post("/", bookController.createBook);      // ➕ Yangi kitob qo‘shish
router.get("/", bookController.getBooks);         // 📋 Barcha kitoblar
router.get("/:id", bookController.getBookById);   // 🔍 Bitta kitob
router.put("/:id", bookController.updateBook);    // ✏️ Kitobni yangilash
router.delete("/:id", bookController.deleteBook); // ❌ Kitobni o‘chirish

module.exports = router;
