const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");

// 📖 Kitob olish va qaytarish
router.post("/", borrowController.borrowBook);         // ➕ Kitob olish
router.put("/:id/return", borrowController.returnBook); // 🔙 Kitob qaytarish

module.exports = router;
