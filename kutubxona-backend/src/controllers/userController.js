const pool = require("../models/db");

// ➕ Yangi o‘quvchi qo‘shish
exports.createUser = async (req, res) => {
  try {
    const { ism, familiya, telefon } = req.body;

    if (!ism || !familiya) {
      return res.status(400).json({ message: "Ism va familiya majburiy!" });
    }

    const result = await pool.query(
      "INSERT INTO users (ism, familiya, telefon) VALUES ($1, $2, $3) RETURNING *",
      [ism, familiya, telefon || null]
    );

    res.status(201).json({
      message: "O‘quvchi muvaffaqiyatli qo‘shildi",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 O‘quvchilar ro‘yxati
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Bitta o‘quvchini ko‘rish
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: "O‘quvchi topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ O‘quvchini yangilash
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ism, familiya, telefon } = req.body;

    const result = await pool.query(
      "UPDATE users SET ism=$1, familiya=$2, telefon=$3 WHERE id=$4 RETURNING *",
      [ism, familiya, telefon || null, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "O‘quvchi topilmadi" });
    }

    res.json({
      message: "O‘quvchi yangilandi",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ O‘quvchini o‘chirish
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: "O‘quvchi topilmadi" });
    }

    res.json({ message: "O‘quvchi muvaffaqiyatli o‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
