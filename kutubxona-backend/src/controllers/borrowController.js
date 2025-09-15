const pool = require("../models/db");

// ➕ Kitob olish
exports.borrowBook = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;

    // 1️⃣ Kitob mavjudligini tekshirish
    const book = await pool.query("SELECT * FROM books WHERE id=$1 AND mavjud=true", [book_id]);
    if (!book.rows.length) {
      return res.status(400).json({ message: "Kitob mavjud emas yoki allaqachon olingan" });
    }

    // 2️⃣ Borrow jadvaliga qo‘shish
    const result = await pool.query(
      "INSERT INTO borrow (user_id, book_id) VALUES ($1, $2) RETURNING *",
      [user_id, book_id]
    );

    // 3️⃣ Kitobni mavjud emas qilib qo‘yish
    await pool.query("UPDATE books SET mavjud=false WHERE id=$1", [book_id]);

    res.status(201).json({
      message: "Kitob muvaffaqiyatli olindi",
      borrow: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔙 Kitobni qaytarish
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params; // borrow ID

    // 1️⃣ Borrow ma’lumotini olish
    const borrow = await pool.query("SELECT * FROM borrow WHERE id=$1", [id]);
    if (!borrow.rows.length) {
      return res.status(404).json({ message: "Ma’lumot topilmadi" });
    }

    // Agar kitob allaqachon qaytarilgan bo‘lsa
    if (borrow.rows[0].qaytarilgan) {
      return res.status(400).json({ message: "Kitob allaqachon qaytarilgan" });
    }

    // 2️⃣ Borrow statusini yangilash
    await pool.query("UPDATE borrow SET qaytarilgan=true WHERE id=$1", [id]);

    // 3️⃣ Kitobni yana mavjud qilish
    await pool.query("UPDATE books SET mavjud=true WHERE id=$1", [borrow.rows[0].book_id]);

    res.json({ message: "Kitob qaytarildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
